#include "stdafx.h"
#include "CJetFlame.h"
#include "CTestScene.h"
#include "CShaderManager.h"

CJetFlame::CJetFlame()
{
	m_nNumTex = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"MissleSplashRef", OBJ_EFFECT)->m_nNumTex;
}

CJetFlame::CJetFlame(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth)
{
	m_pPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth, XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0));

	SetMesh(m_pPlaneMesh);

	bstr_t folderPath = "Effect/JetFlame";
	m_nNumTex = GET_MANAGER<LoadTextureManager>()->LoadTextureFromFolder(pd3dDevice, pd3dCommandList, folderPath, m_pEffectTexture);

	//cout << m_nNumTex;
	m_pJetFlameShader = new CJetFlameShader();
	m_pJetFlameShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	for (int i = 0; i < m_nNumTex; i++) CTestScene::CreateShaderResourceViews(pd3dDevice, m_pEffectTexture[i], 15, false);

	m_pEffectMaterial = new CMaterial(1);
	m_pEffectMaterial->SetTexture(m_pEffectTexture[0]);
	m_pEffectMaterial->SetShader(m_pJetFlameShader);
	SetMaterial(0, m_pEffectMaterial);
}

CJetFlame::~CJetFlame()
{
}

void CJetFlame::Animate(float fTimeElapsed)
{
	m_xmf3Position.x = m_xmf4x4ToParent._41;
	m_xmf3Position.y = m_xmf4x4ToParent._42;
	m_xmf3Position.z = m_xmf4x4ToParent._43;

	//시간 이벤트를 위한 누적 시간
	m_fTimeElapsed += fTimeElapsed;

	TextureAnimate();

	if (GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER));
	{
		SetLookAt(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera->GetPosition());
		if(m_fBurnerBlendAmount < 1.0f)
			SetScale(1.f, m_fBurnerBlendAmount, 0);
		else
			SetScale(1.f, m_fBurnerBlendAmount, 0);
	}
}

void CJetFlame::TextureAnimate()
{
	//해당 오브젝트가 래퍼런스 오브젝트가 아닐경우에만 애니메이트를 실행
	if (!m_bReffernce)
	{
		if (m_fTimeElapsed > m_fFadeFrequence)
		{
			m_pEffectMaterial->m_ppTextures[0] = m_pEffectTexture[m_nTextureIndex];
			m_fTimeElapsed = 0.f;

			if (m_nTextureIndex < m_nNumTex -1)
			{
				m_nTextureIndex++;
			}
			else
			{
				m_nTextureIndex = 0;
			}
		}
	}
}

void CJetFlame::SetLookAt(XMFLOAT3& xmfTarget)
{
	if (GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bEye_fixation == true)
	{
		XMFLOAT3 xmfUp(0.0f, 1.0f, 0.0f);
		XMFLOAT4X4 mtxLookAt = Matrix4x4::LookAtLH(xmfTarget, m_xmf3Position, xmfUp);

		XMFLOAT3 xmf3TargetVector = Vector3::Subtract(xmfTarget, m_xmf3Position);
		xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);

		m_xmf3Up = xmf3TargetVector;
		m_xmf3Look = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetLook();
		m_xmf3Right = Vector3::CrossProduct(m_xmf3Look, m_xmf3Up);
	}
	else
	{
		m_xmf3Right = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetRight();
		m_xmf3Up = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetUp();
		m_xmf3Look = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetLook();
	}
	

	m_xmf4x4ToParent._11 = m_xmf3Right.x;			m_xmf4x4ToParent._12 = m_xmf3Right.y;		m_xmf4x4ToParent._13 = m_xmf3Right.z;
	m_xmf4x4ToParent._21 = m_xmf3Up.x;			m_xmf4x4ToParent._22 = m_xmf3Up.y;		m_xmf4x4ToParent._23 = m_xmf3Up.z;
	m_xmf4x4ToParent._31 = m_xmf3Look.x;		m_xmf4x4ToParent._32 = m_xmf3Look.y;	m_xmf4x4ToParent._33 = m_xmf3Look.z;
	
	Rotate(-90, 0, 0);
}

void CJetFlame::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	if (m_nTextureIndex < m_nNumTex && GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera->m_bDefaultCameraMode == true)
	{
		CGameObject::Render(pd3dCommandList, pCamera);
	}
}
