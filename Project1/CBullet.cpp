#include "stdafx.h"
#include "CBullet.h"
#include "CBoxMesh.h"
#include "CTestScene.h"
#include "CMissleSplash.h"

CBullet::CBullet(XMFLOAT3 xmf3Position)
{
	//OrientedBoxCollider = new COrientedBoxCollider();
	//m_pBulletMesh->SetOOBB(XMFLOAT3(0,0,0), XMFLOAT3(1.0f, 1.0f, 1.0f), XMFLOAT4(0.0f, 0.0f, 0.0f, 1.f));
	m_pBulletMesh = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"bulletRef", OBJ_ALLYBULLET)->m_pBulletMesh;
	SphereCollider = new CSphereCollider();
	SphereCollider->SetSphereCollider(GetPosition(), 5);
	SphereCollider->SetScale(5, 5, 5);
	SetMesh(m_pBulletMesh);
}

CBullet::CBullet(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature)
{
	m_bRefference = true;

	m_pBulletMesh = new CBoxMesh(pd3dDevice, pd3dCommandList, 0.03f, 0.03f, 3.0f);
	SetMesh(m_pBulletMesh);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	m_pBulletTexture = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pBulletTexture->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/Bullet/Bullet.dds", 0);
	m_pBulletShader = new CBulletShader();
	m_pBulletShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	m_pBulletShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);

	CTestScene::CreateShaderResourceViews(pd3dDevice, m_pBulletTexture, 15, false);

	m_pBulletMaterial = new CMaterial(1);
	m_pBulletMaterial->SetTexture(m_pBulletTexture);
	m_pBulletMaterial->SetShader(m_pBulletShader);

	SphereCollider = new CSphereCollider();
	SphereCollider->SetSphereCollider(GetPosition(), 5);
	SphereCollider->SetScale(5, 5, 5);

	SetMaterial(0, m_pBulletMaterial);
}

CBullet::~CBullet()
{
}

void CBullet::Animate(float fTimeElapsed)
{
	if (!m_bRefference)
	{
		m_fBurnerBlendAmount = 1;
		m_xmf3Position.x = m_xmf4x4ToParent._41;
		m_xmf3Position.y = m_xmf4x4ToParent._42;
		m_xmf3Position.z = m_xmf4x4ToParent._43;

		m_fDeleteElapsed += 1 * fTimeElapsed;
		Move(DIR_FORWARD, m_fBulletSpeed * fTimeElapsed);
		
		//if (OrientedBoxCollider)OrientedBoxCollider->SetPosition(GetPosition());
		//if (OrientedBoxCollider)OrientedBoxCollider->Animate(m_pBulletMesh, &m_xmf4x4World, GetPosition());

		if (m_ColliedObj == true)
		{
			if (SphereCollider)SphereCollider->SetPosition(GetPosition());
			if (SphereCollider)SphereCollider->m_xmf4x4ToParent = Matrix4x4::Multiply(XMMatrixScaling(5, 5, 5), m_xmf4x4ToParent);
			if (SphereCollider)SphereCollider->Animate(fTimeElapsed, SphereCollider->GetPosition());
		}

		if (m_fDeleteElapsed > m_fDeleteFrequence)
		{
			m_isDead = true;
		}
	}
}

void CBullet::CollisionActivate(CGameObject* collideTarget)
{
	if (!m_bRefference && collideTarget->m_bDestroyed == false && m_ColliedObj == true)
	{
		std::default_random_engine dre(time(NULL));
		std::uniform_int_distribution<int>Num(0, 1000);
		if(Num(dre) % 2 == 0)
			GET_MANAGER<SoundManager>()->PlaySound(L"GunSplash_1.mp3", CH_SPLASH);
		else
			GET_MANAGER<SoundManager>()->PlaySound(L"GunSplash_2.mp3", CH_SPLASH);

		CMissleSplash* pMissleSplash = new CMissleSplash();
		pMissleSplash = new CMissleSplash();
		pMissleSplash->m_pPlaneMesh = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"MissleSplashRef", OBJ_EFFECT)->m_pPlaneMesh;
		pMissleSplash->SetMesh(pMissleSplash->m_pPlaneMesh);
		for (int i = 0; i < GET_MANAGER<ObjectManager>()->GetObjFromTag(L"MissleSplashRef", OBJ_EFFECT)->m_nNumTex; ++i)
			pMissleSplash->m_pEffectTexture[i] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"MissleSplashRef", OBJ_EFFECT)->m_pEffectTexture[i];
		pMissleSplash->m_pEffectMaterial = new CMaterial(1);
		pMissleSplash->m_pEffectMaterial->SetTexture(pMissleSplash->m_pEffectTexture[0]);
		pMissleSplash->m_pEffectMaterial->SetShader(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"MissleSplashRef", OBJ_EFFECT)->m_EffectShader);
		pMissleSplash->SetMaterial(0, pMissleSplash->m_pEffectMaterial);
		pMissleSplash->SetPosition(m_xmf4x4World._41, m_xmf4x4World._42, m_xmf4x4World._43);
		pMissleSplash->m_fScale = 0.2;
		GET_MANAGER<ObjectManager>()->AddObject(L"MissleSplashInstance", pMissleSplash, OBJ_EFFECT);

		m_isDead = true;
	}
}

void CBullet::Move(DWORD dwDirection, float fDistance)
{
	if (dwDirection)
	{
		XMFLOAT3 xmf3Shift = XMFLOAT3(0, 0, 0);
		if (dwDirection & DIR_FORWARD) xmf3Shift = Vector3::Add(xmf3Shift, m_xmf3Look, fDistance);
		Move(xmf3Shift);
	}
}

void CBullet::Move(const XMFLOAT3& xmf3Shift)
{
	m_xmf3Position = Vector3::Add(m_xmf3Position, xmf3Shift);
	SetPosition(m_xmf3Position);
}

void CBullet::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	if (!m_bRefference && m_ColliedObj == false)
	{
		CGameObject::Render(pd3dCommandList, pCamera);
	}
}
