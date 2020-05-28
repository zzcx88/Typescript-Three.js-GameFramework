#include "stdafx.h"
#include "CNumber.h"
#include "CTestScene.h"

CNumber::CNumber() 
{
	m_nNumTex = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_nNumTex;
	v.reserve(10);
}

CNumber::CNumber(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth) : CPlane()
{
	
	m_bRefference = true;
	m_pUIPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth);

	SetMesh(m_pUIPlaneMesh);

	//CTexture* m_ppUITexture[TEXTURES];

	bstr_t folderPath = "UI/Number";
	m_nNumTex = GET_MANAGER<LoadTextureManager>()->LoadTextureFromFolder(pd3dDevice, pd3dCommandList, folderPath, m_ppUITexture);

	//cout << m_nNumTex << endl;
	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);

	m_pUIShader = new CUIShader();

	m_pUIShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);

	for (int i = 0; i < m_nNumTex + 1; i++) CTestScene::CreateShaderResourceViews(pd3dDevice, m_ppUITexture[i], 15, false);

	m_pUIMaterial = new CMaterial(1);
	m_pUIMaterial->SetTexture(m_ppUITexture[nIndex]);
	m_pUIMaterial->SetShader(m_pUIShader);
	SetMaterial(0, m_pUIMaterial);
}

CNumber::~CNumber()
{
}

void CNumber::Animate(float fTimeElapsed)
{
	//시간 이벤트를 위한 누적 시간
	m_fTimeElapsed += fTimeElapsed;
	m_fFadeTimeElapsed += fTimeElapsed;

	/*if (GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_number", OBJ_UI)->m_fPlayerSpeed > 0.f)
	{
		if(m_iDigits == 0)
			CountNumber();

		if (GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_number", OBJ_UI)->m_fPlayerSpeed > 10.f)
		{
			if (m_iDigits == 1)
				CountNumber();

			if (GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_number", OBJ_UI)->m_fPlayerSpeed > 100.f)
			{
				if (m_iDigits == 2)
					CountNumber();
			}
		}
	}*/

	TextureAnimate();
}

void CNumber::TextureAnimate()
{
	if (!m_bRefference)
	{
		if (m_fFadeTimeElapsed > m_fFadeFrequence)
		{
			m_pUIMaterial->m_ppTextures[0] = m_ppUITexture[num];
			m_fFadeTimeElapsed = 0.f;
		}
	}
}

void CNumber::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	if(CGameObject::GetIsRender())
		CGameObject::Render(pd3dCommandList, pCamera);
	
}

