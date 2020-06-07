#pragma once
#include "stdafx.h"
#include "CBlur.h"
#include "CBlurFilter.h"


CBlurFilter::CBlurFilter(ID3D12Device* device, UINT width, UINT height, DXGI_FORMAT format)
{
	md3dDevice = device;

	mWidth = width;
	mHeight = height;
	mFormat = format;

	BuildResources();
}
CBlurFilter::CBlurFilter()
{
}
CBlurFilter::~CBlurFilter()
{

}
ID3D12Resource* CBlurFilter::Output()
{
	return mBlurMap0.Get();
}

void CBlurFilter::BuildDescriptors(CD3DX12_CPU_DESCRIPTOR_HANDLE hCpuDescriptor,
	CD3DX12_GPU_DESCRIPTOR_HANDLE hGpuDescriptor, UINT descriptorSize)
{
	//서술자에 대한 참조들을 보관해둔다.
	mBlur0CpuSrv = hCpuDescriptor;
	mBlur0CpuUav = hCpuDescriptor.Offset(1, descriptorSize);
	mBlur1CpuSrv = hCpuDescriptor.Offset(1, descriptorSize);
	mBlur1CpuUav = hCpuDescriptor.Offset(1, descriptorSize);

	mBlur0GpuSrv = hGpuDescriptor;
	mBlur0GpuUav = hGpuDescriptor.Offset(1, descriptorSize);
	mBlur1GpuSrv = hGpuDescriptor.Offset(1, descriptorSize);
	mBlur1GpuUav = hGpuDescriptor.Offset(1, descriptorSize);

	BuildDescriptors();
}

void CBlurFilter::OnResize(UINT newWidth, UINT newHeight)
{
	if ((mWidth != newWidth) || (mHeight != newHeight))
	{
		mWidth = newWidth;
		mHeight = newHeight;
		
		//새 크기로 화면 밖 텍스처 자원들을 다시 만든다.
		BuildResources();

		// 자원들이 갱신되었으므로 해당 서술자들도 다시 만든다.
		BuildDescriptors();
	}
}

void CBlurFilter::Execute(ID3D12GraphicsCommandList* pd3dCommandList,
	ID3D12RootSignature* pd3dRootSignature,
	ID3D12PipelineState* horzBlurPSO,
	ID3D12PipelineState* vertBlurPSO,
	ID3D12Resource* input,
	int blurCount)
{
	auto weights = CalcGaussWeights(3.5f);    // 표준 편차를 2.5로 하고 가우스 함수로 가중치를 계산한다.
	int blurRadius = (int)weights.size() / 2;     // 내림(m = n 인 행렬 크기 / 2)

	pd3dCommandList->SetComputeRootSignature(pd3dRootSignature);
	
	pd3dCommandList->SetComputeRoot32BitConstants(17, 1, &blurRadius, 0);
	pd3dCommandList->SetComputeRoot32BitConstants(17, (UINT)weights.size(), weights.data(), 1);

	// GPU가 준비가 안된 상태에서 자원 상태 전이시 자원 위험 상황을 피하기 위해서 상태를 설정하고
	// 응용프로그램이 상태 전이를 D3D에게 보고함으로써 GPU는 자원 위험을 피하는데 조처를 할 수 있다.
	// 전이 자원 장벽들의 배열을 설정하여 한번의 API 호출로 여러개의 자원을 전이할 수 있다.

	// D3D12_RESOURCE_STATE_RENDER_TARGET : 자원이 렌더 대상으로 사용 된다. 
	// 이것은 쓰기 전용 상태이다. 
	// D3D12_RESOURCE_STATE_COPY_SOURCE : 자원이 복사 작업에서 소스로 사용된다. 
	// 이것은 읽기 전용 상태이다. 
	
	// D3D12_RESOURCE_STATE_RENDER_TARGET 에서 
	// D3D12_RESOURCE_STATE_COPY_SOURCE 로 상태 전이
	// 후면 버퍼 자원이 
	// 렌더 대상(쓰기)에서 
	// 복사 작업 소스(읽기)로 상태 전이
	pd3dCommandList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(input,
		D3D12_RESOURCE_STATE_RENDER_TARGET, D3D12_RESOURCE_STATE_COPY_SOURCE));

	// D3D12_RESOURCE_STATE_COMMON : 다른 그래픽 엔진 유형의 자원에 액세스 할 경우에만 응용 프로그램이 이 상태로 전환되어야한다.
	// 특히, 자원은 COPY 큐에서 사용되기 전에(이전에 DIRECT / COMPUTE에서 사용 된 경우) 및 DIRECT / COMPUTE에서 사용되기 전에(이전에 COPY에서 사용 된 경우) COMMON 상태에 있어야한다.
	// D3D12_RESOURCE_STATE_COPY_DEST : 자원이 복사 작업에서 대상으로 사용된다. 
	// 이것은 쓰기 전용 상태이다.
	
	// 화면 밖 텍스처 자원 텍스처 A가 
	// COMMON에서 
	// 복사 작업 대상(쓰기)로 상태 전이
	pd3dCommandList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(mBlurMap0.Get(),
		D3D12_RESOURCE_STATE_COMMON, D3D12_RESOURCE_STATE_COPY_DEST));

	// 후면 버퍼를 BlurMap0에 복사한다.
	pd3dCommandList->CopyResource(mBlurMap0.Get(), input);

	// D3D12_RESOURCE_STATE_GENERIC_READ : 다른 읽기 상태 비트의 논리적 OR 조합이다. 업로드 힙의 필수 시작 상태이다. 
	
	// 화면 밖 텍스처 자원 텍스처 A가 
	// 복사 작업 대상(쓰기)에서 
	// 업로드 힙 시작 상태로 상태 전이
	pd3dCommandList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(mBlurMap0.Get(),
		D3D12_RESOURCE_STATE_COPY_DEST, D3D12_RESOURCE_STATE_GENERIC_READ));

	// D3D12_RESOURCE_STATE_UNORDERED_ACCESS : 자원이 순서없는 액세스에 사용된다.
	// 정렬되지 않은 액세스보기를 통해 GPU가 서브 자원에 액세스 할 때 서브 자원은 이 상태에 있어야한다. 
	// 이것은 읽기/쓰기 상태이다.

	// 화면 밖 텍스처 자원 텍스처 B를
	// COMMON에서 
	// 정렬되지 않은 액세스보기를 통해 GPU가 서브 자원에 액세스 할 수 있도록(읽기/쓰기) 상태 전이
	pd3dCommandList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(mBlurMap1.Get(),
		D3D12_RESOURCE_STATE_COMMON, D3D12_RESOURCE_STATE_UNORDERED_ACCESS));

	for (int i = 0; i < blurCount; ++i)
	{
		//
		// 수평 블러
		//
	
		pd3dCommandList->SetPipelineState(horzBlurPSO);

		pd3dCommandList->SetComputeRootDescriptorTable(1, mBlur0GpuSrv);
		pd3dCommandList->SetComputeRootDescriptorTable(2, mBlur1GpuUav);

		// numGroupsX는 한 행(row)의 이미지 픽셀들을 처리하는 데 필요한
		// 스레드 그룹의 개수이다. 각 그룹은 256개의 픽셀을 처리해야 한다.
		// (256은 계산 셰이더에 정의되어 있는 수치이다.)
		UINT numGroupsX = (UINT)ceilf(mWidth / 256.0f);
		pd3dCommandList->Dispatch(numGroupsX, mHeight, 1); // 컴퓨트 셰이더 실행

		pd3dCommandList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(mBlurMap0.Get(),
			D3D12_RESOURCE_STATE_GENERIC_READ, D3D12_RESOURCE_STATE_UNORDERED_ACCESS));

		pd3dCommandList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(mBlurMap1.Get(),
			D3D12_RESOURCE_STATE_UNORDERED_ACCESS, D3D12_RESOURCE_STATE_GENERIC_READ));

		//
		// 수직 블러
		//
		
		pd3dCommandList->SetPipelineState(vertBlurPSO);

		pd3dCommandList->SetComputeRootDescriptorTable(1, mBlur1GpuSrv);
		pd3dCommandList->SetComputeRootDescriptorTable(2, mBlur0GpuUav);

		// numGroupsY는 한 열 (column)의 이미지 픽셀들을 처리하는데 필요한
		// 스레드 크룹의 개수이다. 각 그룹은 256개의 픽셀을 처리해야 한다.
		// (256은 계산 셰이더에 정의되어 있는 수치이다.)
		UINT numGroupsY = (UINT)ceilf(mHeight / 256.0f);
		pd3dCommandList->Dispatch(mWidth, numGroupsY, 1);

		pd3dCommandList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(mBlurMap0.Get(),
			D3D12_RESOURCE_STATE_UNORDERED_ACCESS, D3D12_RESOURCE_STATE_GENERIC_READ));

		pd3dCommandList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(mBlurMap1.Get(),
			D3D12_RESOURCE_STATE_GENERIC_READ, D3D12_RESOURCE_STATE_UNORDERED_ACCESS));
	}
}

std::vector<float> CBlurFilter::CalcGaussWeights(float sigma)
{
	float twoSigma2 = 2.0f * sigma * sigma;  // 시그마(표준편차)가 커질 수록 이웃 픽셀들에 더 큰 가중치가 부여된다.

	int blurRadius = (int)ceil(2.0f * sigma);  // 베셀 근사법 (블러 반지름 = 올림(2*시그마(표준편차)))

	assert(blurRadius <= MaxBlurRadius);  // true 일경우 아무일 없음, false 일 경우 에러

	std::vector<float> weights;
	weights.resize(2 * blurRadius + 1);  // 행렬 m x n    m = 2a + 1, n = 2b + 1 ( a = b 라고 생각한다 )

	float weightSum = 0.0f;  //  가중치의 합 초기화

	for (int i = -blurRadius; i <= blurRadius; ++i)
	{
		float x = (float)i;

		weights[i + blurRadius] = expf(-x * x / twoSigma2);

		weightSum += weights[i + blurRadius];
	}

	//  가중치 정규화
	for (int i = 0; i < weights.size(); ++i)
	{
		weights[i] /= weightSum; 
	}

	return weights;
}

void CBlurFilter::BuildDescriptors()
{
	//씬에 있음
	D3D12_SHADER_RESOURCE_VIEW_DESC srvDesc = {};
	srvDesc.Shader4ComponentMapping = D3D12_DEFAULT_SHADER_4_COMPONENT_MAPPING;
	srvDesc.Format = mFormat;
	srvDesc.ViewDimension = D3D12_SRV_DIMENSION_TEXTURE2D;
	srvDesc.Texture2D.MostDetailedMip = 0;
	srvDesc.Texture2D.MipLevels = 1;

	D3D12_UNORDERED_ACCESS_VIEW_DESC uavDesc = {};

	uavDesc.Format = mFormat;
	uavDesc.ViewDimension = D3D12_UAV_DIMENSION_TEXTURE2D;
	uavDesc.Texture2D.MipSlice = 0;
	// 씬에 있음

	md3dDevice->CreateShaderResourceView(mBlurMap0.Get(), &srvDesc, mBlur0CpuSrv);
	md3dDevice->CreateUnorderedAccessView(mBlurMap0.Get(), NULL, &uavDesc, mBlur0CpuUav);

	md3dDevice->CreateShaderResourceView(mBlurMap1.Get(), &srvDesc, mBlur1CpuSrv);
	md3dDevice->CreateUnorderedAccessView(mBlurMap1.Get(), NULL, &uavDesc, mBlur1CpuUav);
}

void CBlurFilter::BuildResources()
{
	D3D12_RESOURCE_DESC texDesc;
	ZeroMemory(&texDesc, sizeof(D3D12_RESOURCE_DESC));
	texDesc.Dimension = D3D12_RESOURCE_DIMENSION_TEXTURE2D;
	texDesc.Alignment = 0;
	texDesc.Width = mWidth;
	texDesc.Height = mHeight;
	texDesc.DepthOrArraySize = 1;
	texDesc.MipLevels = 1;
	texDesc.Format = mFormat;
	texDesc.SampleDesc.Count = 1;
	texDesc.SampleDesc.Quality = 0;
	texDesc.Layout = D3D12_TEXTURE_LAYOUT_UNKNOWN;
	texDesc.Flags = D3D12_RESOURCE_FLAG_ALLOW_UNORDERED_ACCESS;

	HRESULT hresult = md3dDevice->CreateCommittedResource(
		&CD3DX12_HEAP_PROPERTIES(D3D12_HEAP_TYPE_DEFAULT),
		D3D12_HEAP_FLAG_NONE,
		&texDesc,
		D3D12_RESOURCE_STATE_COMMON,
		nullptr,
		IID_PPV_ARGS(&mBlurMap0));

	hresult = md3dDevice->CreateCommittedResource(
		&CD3DX12_HEAP_PROPERTIES(D3D12_HEAP_TYPE_DEFAULT),
		D3D12_HEAP_FLAG_NONE,
		&texDesc,
		D3D12_RESOURCE_STATE_COMMON,
		nullptr,
		IID_PPV_ARGS(&mBlurMap1));
}

