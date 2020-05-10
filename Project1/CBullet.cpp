#include "stdafx.h"
#include "CBullet.h"
#include "CBoxMesh.h"
#include "CTestScene.h"

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

	SetMaterial(0, m_pBulletMaterial);
}

CBullet::~CBullet()
{
}

void CBullet::Animate(float fTimeElapsed)
{
	if (!m_bRefference)
	{
		m_xmf3Position.x = m_xmf4x4ToParent._41;
		m_xmf3Position.y = m_xmf4x4ToParent._42;
		m_xmf3Position.z = m_xmf4x4ToParent._43;

		m_fDeleteElapsed += fTimeElapsed;
		Move(DIR_FORWARD, m_fBulletSpeed * fTimeElapsed);

		if (m_fDeleteElapsed > m_fDeleteFrequence)
		{
			m_isDead = true;
		}
	}
}

void CBullet::CollisionActivate(CGameObject* collideTarget)
{
	if (!m_bRefference)
	{
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
	if (!m_bRefference)
	{
		CGameObject::Render(pd3dCommandList, pCamera);
	}
}
