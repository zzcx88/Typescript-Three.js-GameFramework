#include "stdafx.h"
#include "CLockOnUI.h"
#include "CPlaneMesh.h"
#include "CTestScene.h"

#define TEXTURES    4
CLockOnUI::CLockOnUI() {}
CLockOnUI::CLockOnUI(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth, XMFLOAT2 xmf2LeftTop, XMFLOAT2 xmf2LeftBot, XMFLOAT2 xmf2RightBot, XMFLOAT2 xmf2RightTop) : CPlane()
{
	m_pLockOnUIPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth, xmf2LeftTop, xmf2LeftBot, xmf2RightBot, xmf2RightTop);

	SetMesh(m_pLockOnUIPlaneMesh);


	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	m_ppLockOnUITexture[0] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppLockOnUITexture[0]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/Point.dds", 0);
	m_ppLockOnUITexture[1] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppLockOnUITexture[1]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/RedPoint.dds", 0);
	m_ppLockOnUITexture[2] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppLockOnUITexture[2]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/TGTPoint.dds", 0);
	m_ppLockOnUITexture[3] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppLockOnUITexture[3]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/TGTRedPoint.dds", 0);
	m_ppLockOnUITexture[4] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppLockOnUITexture[4]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/Warning.dds", 0);

	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);
	
	m_pLockOnUIShader = new CUIShader();

	m_pLockOnUIShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	m_pLockOnUIShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);

	m_pLockOnUIShader->CreateConstantBufferViews(pd3dDevice, pd3dCommandList, m_nObjects, m_pLockOnUIShader->m_pd3dcbGameObjects, ncbElementBytes);

	for (int i = 0; i < TEXTURES; i++) CTestScene::CreateShaderResourceViews(pd3dDevice, m_ppLockOnUITexture[i], 15, false);

	m_pLockOnUIMaterial = new CMaterial(1);
	m_pLockOnUIMaterial->SetTexture(m_ppLockOnUITexture[nIndex]);
	m_pLockOnUIMaterial->SetShader(m_pLockOnUIShader);
	SetMaterial(0, m_pLockOnUIMaterial);


}

CLockOnUI::~CLockOnUI()
{
}

void CLockOnUI::MoveLockOnUI(XMFLOAT2 screen, XMFLOAT3& xmfTarget, XMFLOAT3& xmfPlayer, XMFLOAT3& xmfPlayerLook, CGameObject* pGameUIOBJ, CCamera* pCamera)
{
	float fx = 0.f;
	float fy = 0.f;

	XMFLOAT3 xmf3TargetVector = Vector3::Subtract(xmfTarget, xmfPlayer);
	xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);

	float xmfAxis = Vector3::DotProduct(xmfPlayerLook, xmf3TargetVector);
	xmfCameraAxis = Vector3::DotProduct(pCamera->GetLookVector(), xmf3TargetVector);
	
	//fx = ((1.f / ((float)FRAME_BUFFER_WIDTH / 2.f)) * screen.x) - 1;
	//fy = (((1.f / ((float)FRAME_BUFFER_HEIGHT / 2.f)) * screen.y) - 1) * -1;
	fx = screen.x - ((float)FRAME_BUFFER_WIDTH / 2.f);
	fy =( screen.y - ((float)FRAME_BUFFER_HEIGHT / 2.f))*-1;

	XMFLOAT3 xmf3TargetVector2 = Vector3::Subtract(xmfTarget, xmfPlayer);

	m_fLenth = sqrt(xmf3TargetVector2.x * xmf3TargetVector2.x + xmf3TargetVector2.y * xmf3TargetVector2.x + xmf3TargetVector2.z * xmf3TargetVector2.z);
	
	if (screen.x < 0 || screen.y < 0 || screen.x >FRAME_BUFFER_WIDTH || screen.y >FRAME_BUFFER_HEIGHT || xmfCameraAxis < 0.f)
	{
		pGameUIOBJ->SetPosition(-20000.f, -20000.f, -1.f);
	}
	else {
		if (m_fLenth < 30000 )
		{
			bDetectable = true;

			if(m_fLenth < 3000 && ((xmfAxis > 0.9f || xmfAxis < -0.9f) && xmfAxis > 0.f))
				bLockOn = true;
			else
				bLockOn = false;
		}
		else
		{
			bDetectable = false;
		}
	
		pGameUIOBJ->SetPosition(fx, fy, 0.f);
	}


}

void CLockOnUI::Animate(float fTimeElapsed)
{
	//시간 이벤트를 위한 누적 시간
	m_fTimeElapsed += fTimeElapsed;
	m_fFadeTimeElapsed += fTimeElapsed;

	//TextureAnimate();
}

void CLockOnUI::TextureAnimate()
{
	if (!m_bRefference)
	{
		if (m_fFadeTimeElapsed > m_fFadeFrequence)
		{
			m_fFadeTimeElapsed = 0.f;

			if (m_nTextureRender < TEXTURES)
			{
				m_nTextureRender++;
			}
			else
			{
				m_nTextureRender = 0;
			}
		}
	}
}

void CLockOnUI::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	if(m_nTextureRender == 0)
		CGameObject::Render(pd3dCommandList, pCamera);
}
