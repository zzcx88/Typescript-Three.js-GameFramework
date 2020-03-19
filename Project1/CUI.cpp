#include "stdafx.h"
#include "CUI.h"
#include "CPlaneMesh.h"
#include "CTestScene.h"

#define TEXTURES    7

CUI::CUI(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth, XMFLOAT2 xmf2LeftTop, XMFLOAT2 xmf2LeftBot, XMFLOAT2 xmf2RightBot, XMFLOAT2 xmf2RightTop) : CPlane()
{

	CPlaneMesh* pUIMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth, xmf2LeftTop, xmf2LeftBot, xmf2RightBot, xmf2RightTop);

	SetMesh(pUIMesh);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	CTexture* ppUITexture[TEXTURES];
	ppUITexture[0] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppUITexture[0]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/UI.dds", 0);
	ppUITexture[1] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppUITexture[1]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/WeaponUI.dds", 0);
	ppUITexture[2] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppUITexture[2]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/TimeScoreUI.dds", 0);
	ppUITexture[3] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppUITexture[3]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/SpeedUI.dds", 0);
	ppUITexture[4] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppUITexture[4]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/AltUI.dds", 0);
	ppUITexture[5] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppUITexture[5]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/Gunammo.dds", 0);
	ppUITexture[6] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppUITexture[6]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/MinimapUI.dds", 0);

	CPlaneShader* pPlaneShader;

	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);
	pPlaneShader = new CPlaneShader();

	pPlaneShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	pPlaneShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);

	pPlaneShader->CreateConstantBufferViews(pd3dDevice, pd3dCommandList, m_nObjects, pPlaneShader->m_pd3dcbGameObjects, ncbElementBytes);

	for (int i = 0; i < TEXTURES; i++) CTestScene::CreateShaderResourceViews(pd3dDevice, ppUITexture[i], 15, false);

	CMaterial* pUIMaterial = new CMaterial(1);
	pUIMaterial->SetTexture(ppUITexture[nIndex]);
	pUIMaterial->SetShader(pPlaneShader);
	SetMaterial(0, pUIMaterial);

}

CUI::~CUI()
{
}

void CUI::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	CPlane::Render(pd3dCommandList, pCamera);
}