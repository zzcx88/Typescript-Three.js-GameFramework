#include "stdafx.h"
#include "CBlur.h"
#include "CBlurFilter.h"
#include "CTestScene.h"
#include "CShaderManager.h"
#include "DeviceManager.h"

CBlur::CBlur(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature) 
{
	//CreateShaderVariables(pd3dDevice, pd3dCommandList);
	CBlurHShader* pBlurHShader = new CBlurHShader();
	pBlurHShader->CreateHShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	//pBlurHShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);
	

	//CTestScene::CreateShaderResourceViews(pd3dDevice, pSkyBoxTexture, 10, false);
}

CBlur::~CBlur()
{
}

void CBlur::Render(ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, ID3D12Resource* CurrentBackBuffer)
{
	CBlurFilter* pBlurFilter = new CBlurFilter();
	pBlurFilter->Execute(pd3dCommandList, pd3dGraphicsRootSignature,
		CurrentBackBuffer, 4);

	// Prepare to copy blurred output to the back buffer.
	pd3dCommandList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(CurrentBackBuffer,
		D3D12_RESOURCE_STATE_COPY_SOURCE, D3D12_RESOURCE_STATE_COPY_DEST));

	pd3dCommandList->CopyResource(CurrentBackBuffer, pBlurFilter->Output());

	// Transition to PRESENT state.
	pd3dCommandList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(CurrentBackBuffer,
		D3D12_RESOURCE_STATE_COPY_DEST, D3D12_RESOURCE_STATE_PRESENT));
}