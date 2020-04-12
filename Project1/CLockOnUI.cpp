#include "stdafx.h"
#include "CLockOnUI.h"
#include "CPlaneMesh.h"
#include "CTestScene.h"

#define TEXTURES    2

CLockOnUI::CLockOnUI(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth, XMFLOAT2 xmf2LeftTop, XMFLOAT2 xmf2LeftBot, XMFLOAT2 xmf2RightBot, XMFLOAT2 xmf2RightTop) : CPlane()
{

	m_pPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth, xmf2LeftTop, xmf2LeftBot, xmf2RightBot, xmf2RightTop);

	SetMesh(m_pPlaneMesh);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	m_ppUITexture[0] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppUITexture[0]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/Point.dds", 0);
	m_ppUITexture[1] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppUITexture[1]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/RedPoint.dds", 0);

	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);
	
	CUIShader* pUIShader;
	pUIShader = new CUIShader();

	pUIShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	pUIShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);

	pUIShader->CreateConstantBufferViews(pd3dDevice, pd3dCommandList, m_nObjects, pUIShader->m_pd3dcbGameObjects, ncbElementBytes);

	for (int i = 0; i < TEXTURES; i++) CTestScene::CreateShaderResourceViews(pd3dDevice, m_ppUITexture[i], 15, false);

	m_pUIMaterial = new CMaterial(1);
	m_pUIMaterial->SetTexture(m_ppUITexture[nIndex]);
	m_pUIMaterial->SetShader(pUIShader);
	SetMaterial(0, m_pUIMaterial);


}

CLockOnUI::~CLockOnUI()
{
}

void CLockOnUI::Render(XMFLOAT2 screen, XMFLOAT3& xmfTarget, XMFLOAT3& xmfPlayer, XMFLOAT3& xmfPlayerLook, CGameObject* pGameOBJ)
{
	float fx = 0.f;
	float fy = 0.f;

	XMFLOAT3 xmf3TargetVector = Vector3::Subtract(xmfTarget, xmfPlayer);
	xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);

	float xmfAxis = Vector3::DotProduct(xmfPlayerLook, xmf3TargetVector);

	fx = ((1.f / ((float)FRAME_BUFFER_WIDTH / 2.f)) * screen.x) - 1;
	fy = (((1.f / ((float)FRAME_BUFFER_HEIGHT / 2.f)) * screen.y) - 1) * -1;

	XMFLOAT3 xmf3TargetVector2 = Vector3::Subtract(xmfTarget, xmfPlayer);
	float Lenth = sqrt(xmf3TargetVector2.x * xmf3TargetVector2.x + xmf3TargetVector2.y * xmf3TargetVector2.x + xmf3TargetVector2.z * xmf3TargetVector2.z);

	cout << Lenth << endl;

	if (screen.x < 0 || screen.y < 0 || screen.x >FRAME_BUFFER_WIDTH || screen.y >FRAME_BUFFER_HEIGHT || xmfAxis < 0.f)
		pGameOBJ->SetPosition(-2.f, -2.f, -1.f);
	else {
		if (Lenth < 1500)
			pGameOBJ->m_pUIMaterial->m_ppTextures[0] = pGameOBJ->m_ppUITexture[1];
		else
			pGameOBJ->m_pUIMaterial->m_ppTextures[0] = pGameOBJ->m_ppUITexture[0];

		pGameOBJ->SetPosition(fx, fy, 0.f);
	}


}


