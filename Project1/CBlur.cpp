#include "stdafx.h"
#include "CBlur.h"
#include "CShaderManager.h"
#include "CTestScene.h"

CBlur::CBlur(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature) : CBlurFilter(pd3dDevice, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT, DXGI_FORMAT_R8G8B8A8_UNORM)
{

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	CBlurHShader* pBlurHShader = new CBlurHShader();
	CBlurVShader* pBlurVShader = new CBlurVShader();

	pBlurHShader->CreateHShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	pBlurVShader->CreateVShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	pBlurHShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);
	pBlurVShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);
	//m_pBlurFilter = new CBlurFilter();

	/*CTestScene::CreateShaderResourceViews(pd3dDevice, pBlurTexture0, 10, false);
	CTestScene::CreateUnorderedAccessViews(pd3dDevice, pBlurTexture0, 10, false);

	CTestScene::CreateShaderResourceViews(pd3dDevice, pBlurTexture1, 10, false);
	CTestScene::CreateUnorderedAccessViews(pd3dDevice, pBlurTexture1, 10, false);*/
}

CBlur::~CBlur()
{
}

void CBlur::Render(ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, CCamera* pCamera,ID3D12Resource* CurrentBackBuffer)
{
	Execute(pd3dCommandList, pd3dGraphicsRootSignature, pCamera,
		CurrentBackBuffer, 4);

	// Prepare to copy blurred output to the back buffer.
	pd3dCommandList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(CurrentBackBuffer,
		D3D12_RESOURCE_STATE_COPY_SOURCE, D3D12_RESOURCE_STATE_COPY_DEST));

	pd3dCommandList->CopyResource(CurrentBackBuffer, Output());

	// Transition to PRESENT state.
	pd3dCommandList->ResourceBarrier(1, &CD3DX12_RESOURCE_BARRIER::Transition(CurrentBackBuffer,
		D3D12_RESOURCE_STATE_COPY_DEST, D3D12_RESOURCE_STATE_PRESENT));
}
