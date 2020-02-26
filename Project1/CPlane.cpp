#include "stdafx.h"
#include "CPlane.h"
#include "CPlaneMesh.h"
#include "CTestScene.h"
#include "CShaderManager.h"

CPlane::CPlane(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature) : CGameObject(1)
{
	CPlaneMesh* pPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, 1.0f, 1.0f, 0.0f);
	SetMesh(pPlaneMesh);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	CTexture* pPlaneTexture = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	//pPlaneTexture->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Model/Textures/water.dds", 0);
	pPlaneTexture->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"SkyBox/UI.dds", 0);
	CPlaneShader* pPlaneShader = new CPlaneShader();

	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);

	pPlaneShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	pPlaneShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);
	
	pPlaneShader->CreateConstantBufferViews(pd3dDevice, pd3dCommandList, 1, pPlaneShader->m_pd3dcbGameObjects, ncbElementBytes);

	CTestScene::CreateShaderResourceViews(pd3dDevice, pPlaneTexture, 15, false);

	CMaterial* pPlaneMaterial = new CMaterial(1);
	pPlaneMaterial->SetTexture(pPlaneTexture);
	pPlaneMaterial->SetShader(pPlaneShader);

	SetMaterial(0, pPlaneMaterial);
}

CPlane::~CPlane()
{
}