#include "stdafx.h"
#include "CAfterBurner.h"
#include "CPlaneMesh.h"
#include "CTestScene.h"
#include "CShaderManager.h"

#define TEXTURES 10

CAfterBurner::CAfterBurner()
{
}

CAfterBurner::CAfterBurner(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth)
{
	m_pPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth, XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0));

	SetMesh(m_pPlaneMesh);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	m_pEffectTexture[0] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pEffectTexture[0]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBurn_Circle.dds", 0);
	m_pEffectTexture[1] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pEffectTexture[1]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBurn_Circle1.dds", 0);
	m_pEffectTexture[2] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pEffectTexture[2]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBurn_Circle2.dds", 0);
	m_pEffectTexture[3] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pEffectTexture[3]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBurn_Circle3.dds", 0);
	m_pEffectTexture[4] = new CTexture(1, RESOURCE_TEXTURE2D, 0);				
	m_pEffectTexture[4]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBurn_Circle4.dds", 0);
	m_pEffectTexture[5] = new CTexture(1, RESOURCE_TEXTURE2D, 0);			
	m_pEffectTexture[5]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBurn_Circle5.dds", 0);
	m_pEffectTexture[6] = new CTexture(1, RESOURCE_TEXTURE2D, 0);				
	m_pEffectTexture[6]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBurn_Circle6.dds", 0);
	m_pEffectTexture[7] = new CTexture(1, RESOURCE_TEXTURE2D, 0);	
	m_pEffectTexture[7]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBurn_Circle7.dds", 0);
	m_pEffectTexture[8] = new CTexture(1, RESOURCE_TEXTURE2D, 0);	
	m_pEffectTexture[8]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBurn_Circle8.dds", 0);
	m_pEffectTexture[9] = new CTexture(1, RESOURCE_TEXTURE2D, 0);	
	m_pEffectTexture[9]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBurn_Circle9.dds", 0);

	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);
	m_PlaneShader = new CPlaneShader();

	m_PlaneShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	m_PlaneShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);

	for (int i = 0; i < TEXTURES; i++) CTestScene::CreateShaderResourceViews(pd3dDevice, m_pEffectTexture[i], 15, false);
	CTestScene::CreateShaderResourceViews(pd3dDevice, m_pEffectTexture[0], 15, false);
	m_pEffectMaterial = new CMaterial(1);
	m_pEffectMaterial->SetTexture(m_pEffectTexture[0]);
	m_pEffectMaterial->SetShader(m_PlaneShader);
	SetMaterial(0, m_pEffectMaterial);
}

CAfterBurner::~CAfterBurner()
{
}

void CAfterBurner::Animate(float fTimeElapsed)
{
	if (!m_bRefference)
	{
		//m_fBurnerBlendAmount = 0.3f;
		/*m_xmf3Position.x = m_xmf4x4ToParent._41;
		m_xmf3Position.y = m_xmf4x4ToParent._42;
		m_xmf3Position.z = m_xmf4x4ToParent._43;*/
		//SetLookAt(m_pCamera->GetPosition());
	}
}

void CAfterBurner::TextureAnimate()
{
	//해당 오브젝트가 래퍼런스 오브젝트가 아닐경우에만 애니메이트를 실행
	if (!m_bRefference)
	{
		//m_fFadeFrequence : 텍스쳐 교체주기, 얼마만큼의 주기에 변경 시킬지 원하는 값을 셋팅하면 됨
		if (m_fFadeTimeElapsed > m_fFadeFrequence)
		{
			//텍스쳐 교체가 일어난다
			m_pEffectMaterial->m_ppTextures[0] = m_pEffectTexture[m_nTextureIndex];
			//텍스쳐 교체 주기를 체크하기 위한 누적 시간을 다시 0으로 초기화 한다
			m_fFadeTimeElapsed = 0.f;
			//텍스쳐 교체는 준비된 텍스쳐 갯수 만큼만 교체 되도록 한다.
			if (m_nTextureIndex < TEXTURES)
			{
				m_nTextureIndex++;
			}
			//else 부분은 사용하고 싶으면 사용하면 됨, 아래 코드는 모든 텍스쳐 애니메이션이 끝나면 오브젝트를 delete하는 코드임
			else
			{
				m_isDead = true;
			}
		}
	}
}

void CAfterBurner::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	if(!m_RenderOff)
		CGameObject::Render(pd3dCommandList, pCamera);
}
