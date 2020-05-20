#include "stdafx.h"
#include "CMinimap.h"
#include "CPlaneMesh.h"
#include "CTestScene.h"

#define TEXTURES 1
CMinimap::CMinimap()
{}

CMinimap::CMinimap(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth,
	XMFLOAT2 xmf2LeftTop, XMFLOAT2 xmf2LeftBot, XMFLOAT2 xmf2RightBot, XMFLOAT2 xmf2RightTop) : CPlane()
{
	m_pUIPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth, xmf2LeftTop, xmf2LeftBot, xmf2RightBot, xmf2RightTop, 1.0f, 1.0f);

	SetMesh(m_pUIPlaneMesh);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	//CTexture* m_ppUITexture[TEXTURES];


	m_ppUITexture[0] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppUITexture[0]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/MinimapUI.dds", 0);
	


	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);


	m_pMinimapShader = new CMinimapShader();

	m_pMinimapShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	m_pMinimapShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);


	for (int i = 0; i < TEXTURES; i++) CTestScene::CreateShaderResourceViews(pd3dDevice, m_ppUITexture[i], 15, false);

	m_pUIMaterial = new CMaterial(1);
	m_pUIMaterial->SetTexture(m_ppUITexture[nIndex]);
	m_pUIMaterial->SetShader(m_pMinimapShader);
	SetMaterial(0, m_pUIMaterial);
}

CMinimap::~CMinimap()
{
}