#include "stdafx.h"
#include "CPlane.h"
#include "CPlaneMesh.h"
#include "CTestScene.h"
#include "CShaderManager.h"

#define TEXTURES    7

CPlane::CPlane(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature,float fWidth, float fHeight, float fDepth, XMFLOAT2 xmf2LeftTop, XMFLOAT2 xmf2LeftBot, XMFLOAT2 xmf2RightBot, XMFLOAT2 xmf2RightTop) : CGameObject(1)
{
	
	CPlaneMesh* pPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth,  xmf2LeftTop,  xmf2LeftBot,  xmf2RightBot,  xmf2RightTop);

	SetMesh(pPlaneMesh);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	CTexture* ppPlaneTexture[TEXTURES];
	ppPlaneTexture[0] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	//pPlaneTexture->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Model/Textures/water.dds", 0);
	ppPlaneTexture[0]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/UI.dds", 0);
	ppPlaneTexture[1] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppPlaneTexture[1]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/WeaponUI.dds", 0);
	ppPlaneTexture[2] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppPlaneTexture[2]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/TimeScoreUI.dds", 0);
	ppPlaneTexture[3] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppPlaneTexture[3]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/SpeedUI.dds", 0);
	ppPlaneTexture[4] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppPlaneTexture[4]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/AltUI.dds", 0);
	ppPlaneTexture[5] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppPlaneTexture[5]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/Gunammo.dds", 0);
	ppPlaneTexture[6] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppPlaneTexture[6]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/MinimapUI.dds", 0);

	CPlaneShader* pPlaneShader;

	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);
	pPlaneShader = new CPlaneShader();

	pPlaneShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	pPlaneShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);

	pPlaneShader->CreateConstantBufferViews(pd3dDevice, pd3dCommandList, m_nObjects, pPlaneShader->m_pd3dcbGameObjects, ncbElementBytes);

	for (int i = 0; i < TEXTURES; i++) CTestScene::CreateShaderResourceViews(pd3dDevice, ppPlaneTexture[i], 15, false);
	
	CMaterial* pPlaneMaterial = new CMaterial(1);
	pPlaneMaterial->SetTexture(ppPlaneTexture[nIndex]);
	pPlaneMaterial->SetShader(pPlaneShader);
	SetMaterial(0, pPlaneMaterial);
	
}

CPlane::~CPlane()
{
}

void CPlane::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	XMFLOAT3 xmf3CameraPos = pCamera->GetPosition();
	SetPosition(xmf3CameraPos.x, xmf3CameraPos.y, xmf3CameraPos.z);

	CGameObject::Render(pd3dCommandList, pCamera);
}