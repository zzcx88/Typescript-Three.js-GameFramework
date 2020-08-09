#include "stdafx.h"
#include "AnimateMenuTitle.h"
#include "CTestScene.h"

AnimateMenuTitle::AnimateMenuTitle()
{
	m_nNumTex = 5;
}

AnimateMenuTitle::AnimateMenuTitle(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth) : CPlane()
{
	m_pUIPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth);

	SetMesh(m_pUIPlaneMesh);

	//CTexture* m_ppUITexture[TEXTURES];

	bstr_t folderPath = "UI/Title";
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

AnimateMenuTitle::~AnimateMenuTitle()
{

}

void AnimateMenuTitle::Animate(float fTimeElapsed)
{
	//시간 이벤트를 위한 누적 시간
	m_fTimeElapsed += fTimeElapsed;
	m_fFadeTimeElapsed += fTimeElapsed;

	TextureAnimate();
}

void AnimateMenuTitle::TextureAnimate()
{

	/*	if (m_fFadeTimeElapsed > m_fFadeFrequence)
		{
			m_pUIMaterial->m_ppTextures[0] = m_ppUITexture[m_nTextureIndex];
			m_fFadeTimeElapsed = 0.f;

			if ( m_nTextureIndex >= m_nNumTex -1)
			{
				sub = true;
				add = false;
				
			}
			else if(m_nTextureIndex <= 0)
			{
				add = true;
				sub = false;
			}

			if(add)
				m_nTextureIndex = 4;
			else if(sub)
				m_nTextureIndex = 0;
		}*/
	
}

void AnimateMenuTitle::CountNumber()
{

}

void AnimateMenuTitle::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{

	CGameObject::Render(pd3dCommandList, pCamera);

}
