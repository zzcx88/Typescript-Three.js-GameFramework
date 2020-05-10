#include "stdafx.h"
#include "CNumber.h"
#include "CTestScene.h"

CNumber::CNumber() 
{
	m_nNumTex = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_number", OBJ_UI)->m_nNumTex;
}

CNumber::CNumber(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth) : CPlane()
{
	
	m_bRefference = true;
	m_pUIPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth);

	SetMesh(m_pUIPlaneMesh);

	//CTexture* m_ppUITexture[TEXTURES];

	bstr_t folderPath = "UI/Number";
	m_nNumTex = GET_MANAGER<LoadTextureManager>()->LoadTextureFromFolder(pd3dDevice, pd3dCommandList, folderPath, m_ppUITexture);

	cout << m_nNumTex << endl;
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
	//TextureAnimate();
}

void CNumber::TextureAnimate(int nPlayerSpeed, CGameObject* ppGameOBJs[])
{
	vector<int> v;

	while (nPlayerSpeed != 0)
	{
		v.emplace_back(nPlayerSpeed % 10);

		nPlayerSpeed /= 10;
	}

	if (v.size() > 0)
		ppGameOBJs[10]->m_pUIMaterial->m_ppTextures[0] = ppGameOBJs[10]->m_ppUITexture[v[0]];
	if (v.size() > 1)
		ppGameOBJs[11]->m_pUIMaterial->m_ppTextures[0] = ppGameOBJs[11]->m_ppUITexture[v[1]];
	if (v.size() > 2)
	{
		ppGameOBJs[12]->m_pUIMaterial->m_ppTextures[0] = ppGameOBJs[12]->m_ppUITexture[v[2]];
		ppGameOBJs[13]->m_pUIMaterial->m_ppTextures[0] = ppGameOBJs[13]->m_ppUITexture[0];
	}
	if (v.size() > 3)
		ppGameOBJs[13]->m_pUIMaterial->m_ppTextures[0] = ppGameOBJs[13]->m_ppUITexture[v[3]];

	v.clear();
}

void CNumber::CountNumber() 
{
	
}

void CNumber::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{

	CGameObject::Render(pd3dCommandList, pCamera);
	
}
