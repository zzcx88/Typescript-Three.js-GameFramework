#include "stdafx.h"
#include "CAnimateUI.h"
#include "CPlaneMesh.h"
#include "CTestScene.h"

#define TEXTURES 8
CAnimateUI::CAnimateUI()
{}

CAnimateUI::CAnimateUI(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth,
	XMFLOAT2 xmf2LeftTop, XMFLOAT2 xmf2LeftBot, XMFLOAT2 xmf2RightBot, XMFLOAT2 xmf2RightTop) : CPlane()
{
	m_pUIPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth, xmf2LeftTop, xmf2LeftBot, xmf2RightBot, xmf2RightTop, 1.0f, 1.0f);

	SetMesh(m_pUIPlaneMesh);

	m_fBurnerBlendAmount = 0.f;

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	//CTexture* m_ppUITexture[TEXTURES];

	m_ppUITexture[0] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppUITexture[0]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/fog2.dds", 0);
	m_ppUITexture[1] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppUITexture[1]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/Ending_credit.dds", 0);
	m_ppUITexture[2] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppUITexture[2]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/Press_button.dds", 0);
	m_ppUITexture[3] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppUITexture[3]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/Ending_credit1.dds", 0);
	m_ppUITexture[4] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppUITexture[4]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/Ending_credit2.dds", 0);
	m_ppUITexture[5] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppUITexture[5]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/Ending_credit3.dds", 0);
	m_ppUITexture[6] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppUITexture[6]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/Ending_credit4.dds", 0);

	m_ppUITexture[7] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppUITexture[7]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/Black_fog.dds", 0);
	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);


	m_pAnimateUIShader = new CAnimateUIShader();

	m_pAnimateUIShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	m_pAnimateUIShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);

	m_pAnimateUIShader->CreateConstantBufferViews(pd3dDevice, pd3dCommandList, m_nObjects, m_pAnimateUIShader->m_pd3dcbGameObjects, ncbElementBytes);

	for (int i = 0; i < TEXTURES; i++) CTestScene::CreateShaderResourceViews(pd3dDevice, m_ppUITexture[i], 15, false);

	m_pUIMaterial = new CMaterial(1);
	m_pUIMaterial->SetTexture(m_ppUITexture[nIndex]);
	m_pUIMaterial->SetShader(m_pAnimateUIShader);
	SetMaterial(0, m_pUIMaterial);
}

CAnimateUI::~CAnimateUI()
{
}
void CAnimateUI::Animate(float fTimeElapsed)
{

}

void CAnimateUI::SetLookAt(XMFLOAT3& xmfTarget)
{

}

void CAnimateUI::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	if (CGameObject::GetIsRender())
		CGameObject::Render(pd3dCommandList, pCamera);

}