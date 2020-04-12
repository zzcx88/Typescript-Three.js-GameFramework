#include "stdafx.h"
#include "CUI.h"
#include "CPlaneMesh.h"
#include "CTestScene.h"

#define TEXTURES 9

CUI::CUI(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth, XMFLOAT2 xmf2LeftTop, XMFLOAT2 xmf2LeftBot, XMFLOAT2 xmf2RightBot, XMFLOAT2 xmf2RightTop) : CPlane()
{

	m_pPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth, xmf2LeftTop, xmf2LeftBot, xmf2RightBot, xmf2RightTop);

	SetMesh(m_pPlaneMesh);
	
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
	ppUITexture[7] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppUITexture[7]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/MinimapPoint.dds", 0);
	ppUITexture[8] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	ppUITexture[8]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/MinimapRedPoint.dds", 0);

	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);
	
	CUIShader* pUIShader;
	pUIShader = new CUIShader();

	pUIShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	pUIShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);

	pUIShader->CreateConstantBufferViews(pd3dDevice, pd3dCommandList, m_nObjects, pUIShader->m_pd3dcbGameObjects, ncbElementBytes);

	for (int i = 0; i < TEXTURES; i++) CTestScene::CreateShaderResourceViews(pd3dDevice, ppUITexture[i], 15, false);

	m_pUIMaterial = new CMaterial(1);
	m_pUIMaterial->SetTexture(ppUITexture[nIndex]);
	m_pUIMaterial->SetShader(pUIShader);
	SetMaterial(0, m_pUIMaterial);
}

CUI::~CUI()
{
}

void CUI::MoveMinimapPoint(XMFLOAT3& xmfPlayer, CGameObject* pGameOBJ)
{
	float fx = 0.f;
	float fy = 0.f;
	
	float ax = 1.f / 60000.f * 0.54;
	float ay = 1.f / 60000.f* 0.96;

	fx = (ax*(xmfPlayer.x+30000.f))-1;
	fy = (ay*(xmfPlayer.z+30000.f))-1;

	if (fx > -0.1f)
		fx = -0.1f;
	else if (fy > -0.1f)
		fy = -0.1f;
	else if (fx < -1.f)
		fx = -1.f;
	else if (fy < -1.f)
		fy = -1.f;

	pGameOBJ->SetPosition(fx, fy, 0.f);

	cout << fx << ", " << fy << endl;
}
