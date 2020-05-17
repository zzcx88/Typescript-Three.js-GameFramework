#pragma once

class CBlurFilter
{
public:
	CBlurFilter(ID3D12Device* device, UINT width, UINT height, DXGI_FORMAT format);
	CBlurFilter();
	CBlurFilter(const CBlurFilter& rhs) = delete;
	CBlurFilter& operator=(const CBlurFilter& rhs) = delete;
	~CBlurFilter();

	ID3D12Resource* Output();

	void BuildDescriptors(															// 자원들이 변경되었을 때 해당 서술자들을 다시 생성하기 위한 함수
		CD3DX12_CPU_DESCRIPTOR_HANDLE hCpuDescriptor,
		CD3DX12_GPU_DESCRIPTOR_HANDLE hGpuDescriptor,
		UINT descriptorSize);
	void OnResize(UINT newWidth, UINT newHeight);					// 클라이언트 창이 바뀔 경우 대비하는 함수

	void Execute(																// 각 방향으로 배분할 스레드 그룹 개수를 파악하고, 흐리기 연산을 위한 계산 셰이더 호출 명령을 등록하는 함수
		ID3D12GraphicsCommandList* pd3dCommandList,
		ID3D12RootSignature* pd3dRootSignature,
		ID3D12PipelineState* horzBlurPSO,
		ID3D12PipelineState* vertBlurPSO,
		ID3D12Resource* input,
		int blurCount);


	CShader* m_pShader = NULL;
private:
	std::vector<float> CalcGaussWeights(float sigma);					//  가우스 함수로 가중치 구하는 함수 2차원 흐리기보다 1차원 흐리기의 표본 갯수가 훨씬 적다.

	void BuildDescriptors();															// 그래픽스 파이프라인에 Bind 될 서술자 객체를 만듬
	void BuildResources();															// 서술자가 참조할 자원을 만듬

private:


	const int MaxBlurRadius = 10;															// 최대 블러 반지름

	ID3D12Device* md3dDevice = nullptr;

	UINT mWidth = FRAME_BUFFER_WIDTH;
	UINT mHeight = FRAME_BUFFER_HEIGHT;
	DXGI_FORMAT mFormat = DXGI_FORMAT_R8G8B8A8_UNORM;

	CD3DX12_CPU_DESCRIPTOR_HANDLE mBlur0CpuSrv;
	CD3DX12_CPU_DESCRIPTOR_HANDLE mBlur0CpuUav;

	CD3DX12_CPU_DESCRIPTOR_HANDLE mBlur1CpuSrv;
	CD3DX12_CPU_DESCRIPTOR_HANDLE mBlur1CpuUav;

	CD3DX12_GPU_DESCRIPTOR_HANDLE mBlur0GpuSrv;
	CD3DX12_GPU_DESCRIPTOR_HANDLE mBlur0GpuUav;

	CD3DX12_GPU_DESCRIPTOR_HANDLE mBlur1GpuSrv;
	CD3DX12_GPU_DESCRIPTOR_HANDLE mBlur1GpuUav;

	// Two for ping-ponging the textures.
	Microsoft::WRL::ComPtr<ID3D12Resource> mBlurMap0 = nullptr;
	Microsoft::WRL::ComPtr<ID3D12Resource> mBlurMap1 = nullptr;
};