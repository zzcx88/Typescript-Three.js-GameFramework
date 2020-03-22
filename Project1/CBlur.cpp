#include "stdafx.h"
#include "CBlur.h"
#include "CShaderManager.h"
#include "CTestScene.h"

CBlur::CBlur(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature) 
{

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);
	CBlurHShader* pBlurHShader = new CBlurHShader();
	CBlurVShader* pBlurVShader = new CBlurVShader();

	pBlurHShader->CreateHShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	pBlurVShader->CreateVShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	pBlurHShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);
	pBlurVShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);
	
	//m_pBlurFilter = new CBlurFilter();
	m_pHBlurPipelineState = pBlurHShader->GetHorzPipelineState();
	m_pVBlurPipelineState = pBlurVShader->GetVertPipelineState();

	//CTestScene::CreateShaderResourceViews(pd3dDevice, pBlurTexture0, 11, false);
	//CTestScene::CreateUnorderedAccessViews(pd3dDevice, pBlurTexture0, 11, false);

	//CTestScene::CreateShaderResourceViews(pd3dDevice, pBlurTexture1, 11, false);
	//CTestScene::CreateUnorderedAccessViews(pd3dDevice, pBlurTexture1, 11, false);
}

CBlur::~CBlur()
{
}
void CBlur::CreateShaderVariables(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList)
{
}
