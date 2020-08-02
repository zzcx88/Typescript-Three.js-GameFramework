#include "stdafx.h"
#include "CWater.h"
#include "CTestScene.h"

CWater::CWater(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth)
{
	CPlaneMesh* pUIMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth, XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0), 64.f, 32.f);

	SetMesh(pUIMesh);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	CTexture* pTexture[TEXTURES];
	pTexture[0] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	pTexture[0]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/Water_base.dds", 0);
	pTexture[1] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	pTexture[1]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/water_Normal.dds", 0);

	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);
	CWaterShader* pWaterShader;

	pWaterShader = new CWaterShader();

	pWaterShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	pWaterShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);
	pWaterShader->CreateConstantBufferViews(pd3dDevice, pd3dCommandList, m_nObjects, pWaterShader->m_pd3dcbGameObjects, ncbElementBytes);

	for (int i = 0; i < TEXTURES; i++) CTestScene::CreateShaderResourceViews(pd3dDevice, pTexture[i], 15, false);

	CMaterial* pUIMaterial = new CMaterial(1);
	pUIMaterial->SetTexture(pTexture[nIndex]);
	pUIMaterial->SetShader(pWaterShader);
	SetMaterial(0, pUIMaterial);
}

CWater::~CWater()
{
}

void CWater::Animate(float fTimeElapsed)
{
	//m_fBurnerBlendAmount += 0.1f * fTimeElapsed;
}

void CWater::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	CGameObject::Render(pd3dCommandList, pCamera);
}
