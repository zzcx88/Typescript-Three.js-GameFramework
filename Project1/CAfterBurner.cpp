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
	m_pEffectTexture[0]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBuner.dds", 0);
	m_pEffectTexture[1] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pEffectTexture[1]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBuner1.dds", 0);
	m_pEffectTexture[2] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pEffectTexture[2]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBuner2.dds", 0);
	m_pEffectTexture[3] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pEffectTexture[3]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBuner3.dds", 0);
	m_pEffectTexture[4] = new CTexture(1, RESOURCE_TEXTURE2D, 0);				
	m_pEffectTexture[4]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBuner4.dds", 0);
	m_pEffectTexture[5] = new CTexture(1, RESOURCE_TEXTURE2D, 0);			
	m_pEffectTexture[5]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBuner5.dds", 0);
	m_pEffectTexture[6] = new CTexture(1, RESOURCE_TEXTURE2D, 0);				
	m_pEffectTexture[6]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBuner6.dds", 0);
	m_pEffectTexture[7] = new CTexture(1, RESOURCE_TEXTURE2D, 0);	
	m_pEffectTexture[7]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBuner7.dds", 0);
	m_pEffectTexture[8] = new CTexture(1, RESOURCE_TEXTURE2D, 0);	
	m_pEffectTexture[8]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBuner8.dds", 0);
	m_pEffectTexture[9] = new CTexture(1, RESOURCE_TEXTURE2D, 0);	
	m_pEffectTexture[9]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/AfterBurner/AfterBuner9.dds", 0);

	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);
	m_EffectShader = new CMissleFogShader();

	m_EffectShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	m_EffectShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);

	m_EffectShader->CreateConstantBufferViews(pd3dDevice, pd3dCommandList, m_nObjects, m_EffectShader->m_pd3dcbBlendAmount, ncbElementBytes);

	for (int i = 0; i < TEXTURES; i++) CTestScene::CreateShaderResourceViews(pd3dDevice, m_pEffectTexture[i], 15, false);
	CTestScene::CreateShaderResourceViews(pd3dDevice, m_pEffectTexture[0], 15, false);

	m_pEffectMaterial = new CMaterial(1);
	m_pEffectMaterial->SetTexture(m_pEffectTexture[0]);
	m_pEffectMaterial->SetShader(m_EffectShader);
	SetMaterial(0, m_pEffectMaterial);
}

CAfterBurner::~CAfterBurner()
{
}

void CAfterBurner::Animate(float fTimeElapsed)
{
	if (!m_bRefference)
	{
		m_xmf3Position.x = m_xmf4x4ToParent._41;
		m_xmf3Position.y = m_xmf4x4ToParent._42;
		m_xmf3Position.z = m_xmf4x4ToParent._43;

		SetLookAt(m_pCamera->GetPosition());
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

void CAfterBurner::SetLookAt(XMFLOAT3& xmfTarget)
{
	XMFLOAT3 xmfUp(0.0f, 1.0f, 0.0f);
	XMFLOAT4X4 mtxLookAt = Matrix4x4::LookAtLH(xmfTarget, m_xmf3Position, xmfUp);
	m_xmf3Right = XMFLOAT3(mtxLookAt._11, mtxLookAt._21, mtxLookAt._31);
	m_xmf3Up = XMFLOAT3(mtxLookAt._12, mtxLookAt._22, mtxLookAt._32);
	m_xmf3Look = XMFLOAT3(mtxLookAt._13, mtxLookAt._23, mtxLookAt._33);
	m_xmf4x4ToParent._11 = m_xmf3Right.x;			m_xmf4x4ToParent._12 = m_xmf3Right.y;		m_xmf4x4ToParent._13 = m_xmf3Right.z;
	m_xmf4x4ToParent._21 = m_xmf3Up.x;			m_xmf4x4ToParent._22 = m_xmf3Up.y;		m_xmf4x4ToParent._23 = m_xmf3Up.z;
	m_xmf4x4ToParent._31 = m_xmf3Look.x;		m_xmf4x4ToParent._32 = m_xmf3Look.y;	m_xmf4x4ToParent._33 = m_xmf3Look.z;
}

void CAfterBurner::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	if(!m_RenderOff)
		CGameObject::Render(pd3dCommandList, pCamera);
}
