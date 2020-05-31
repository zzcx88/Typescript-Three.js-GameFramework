#include "stdafx.h"
#include "CMissleSplash.h"
#include "CTestScene.h"
CMissleSplash::CMissleSplash()
{
	//m_fBurnerBlendAmount = 0.8;
	m_nNumTex = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"MissleSplashRef", OBJ_EFFECT)->m_nNumTex;
}

CMissleSplash::CMissleSplash(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth)
{
	m_bRefference = true;
	m_pPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth, XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0));

	SetMesh(m_pPlaneMesh);

	bstr_t folderPath = "Effect/Splash/MissleSplash";
	m_nNumTex = GET_MANAGER<LoadTextureManager>()->LoadTextureFromFolder(pd3dDevice, pd3dCommandList, folderPath, m_pEffectTexture);

	//cout << m_nNumTex;
	m_EffectShader = new CMissleFogShader();
	m_EffectShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	for (int i = 0; i < m_nNumTex; i++) CTestScene::CreateShaderResourceViews(pd3dDevice, m_pEffectTexture[i], 15, false);

	m_pEffectMaterial = new CMaterial(1);
	m_pEffectMaterial->SetTexture(m_pEffectTexture[0]);
	m_pEffectMaterial->SetShader(m_EffectShader);
	SetMaterial(0, m_pEffectMaterial);
}

CMissleSplash::~CMissleSplash()
{
}

void CMissleSplash::Animate(float fTimeElapsed)
{
	m_xmf3Position.x = m_xmf4x4ToParent._41;
	m_xmf3Position.y = m_xmf4x4ToParent._42;
	m_xmf3Position.z = m_xmf4x4ToParent._43;

	//시간 이벤트를 위한 누적 시간
	m_fTimeElapsed += fTimeElapsed;
	m_fFadeTimeElapsed += fTimeElapsed;

	TextureAnimate();

	if (GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER));
	{
		SetLookAt(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera->GetPosition());
	}
}

void CMissleSplash::TextureAnimate()
{
	//해당 오브젝트가 래퍼런스 오브젝트가 아닐경우에만 애니메이트를 실행
	if (!m_bRefference)
	{
		if (m_fFadeTimeElapsed > m_fFadeFrequence)
		{
			m_pEffectMaterial->m_ppTextures[0] = m_pEffectTexture[m_nTextureIndex];
			m_fFadeTimeElapsed = 0.f;

			if (m_nTextureIndex < m_nNumTex)
			{
				m_nTextureIndex++;
			}
			else
			{
				m_isDead = true;
			}
		}
	}
}

void CMissleSplash::SetLookAt(XMFLOAT3& xmfTarget)
{
	XMFLOAT3 xmfUp(0.0f, 0.0f, 1.0f);
	XMFLOAT4X4 mtxLookAt = Matrix4x4::LookAtLH(xmfTarget, m_xmf3Position, xmfUp);
	m_xmf3Right = XMFLOAT3(mtxLookAt._11, mtxLookAt._21, mtxLookAt._31);
	m_xmf3Up = XMFLOAT3(mtxLookAt._12, mtxLookAt._22, mtxLookAt._32);
	m_xmf3Look = XMFLOAT3(mtxLookAt._13, mtxLookAt._23, mtxLookAt._33);
	m_xmf4x4ToParent._11 = m_xmf3Right.x;			m_xmf4x4ToParent._12 = m_xmf3Right.y;		m_xmf4x4ToParent._13 = m_xmf3Right.z;
	m_xmf4x4ToParent._21 = m_xmf3Up.x;			m_xmf4x4ToParent._22 = m_xmf3Up.y;		m_xmf4x4ToParent._23 = m_xmf3Up.z;
	m_xmf4x4ToParent._31 = m_xmf3Look.x;		m_xmf4x4ToParent._32 = m_xmf3Look.y;	m_xmf4x4ToParent._33 = m_xmf3Look.z;
}

void CMissleSplash::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	if (m_nTextureIndex < m_nNumTex-1)
	{
		CGameObject::Render(pd3dCommandList, pCamera);
	}
}
