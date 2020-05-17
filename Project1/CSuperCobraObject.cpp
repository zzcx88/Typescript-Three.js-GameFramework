#include "stdafx.h"
#include "CSuperCobraObject.h"
#include "CUI.h"
#include "CLockOnUI.h"

CSuperCobraObject::CSuperCobraObject(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature)
{
	p052C = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature, "Model/F-4E_Phantom_II.bin", NULL, MODEL_ACE);
	SphereCollider = new CSphereCollider(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	SphereCollider->SetScale(10, 10, 10);
	SphereCollider->SetSphereCollider(GetPosition(), 10.0f);

	m_xmf3Look = GetLook();
	m_xmf3Right = GetRight();
	m_xmf3Up = GetUp();

	SetChild(p052C->m_pModelRootObject);

	OnPrepareAnimate();

	CreateShaderVariables(pd3dDevice, pd3dCommandList);
}

CSuperCobraObject::~CSuperCobraObject()
{
}

void CSuperCobraObject::OnPrepareAnimate()
{
	//m_pMainRotorFrame = FindFrame("MainRotor");
	//m_pTailRotorFrame = FindFrame("TailRotor");
}

void CSuperCobraObject::Animate(float fTimeElapsed)
{
	m_xmf3Position.x = m_xmf4x4ToParent._41;
	m_xmf3Position.y = m_xmf4x4ToParent._42;
	m_xmf3Position.z = m_xmf4x4ToParent._43;

	if (m_pMainRotorFrame)
	{
		XMMATRIX xmmtxRotate = XMMatrixRotationY(XMConvertToRadians(360.0f * 4.0f) * fTimeElapsed);
		m_pMainRotorFrame->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate, m_pMainRotorFrame->m_xmf4x4ToParent);
	}
	if (m_pTailRotorFrame)
	{
		XMMATRIX xmmtxRotate = XMMatrixRotationX(XMConvertToRadians(360.0f * 4.0f) * fTimeElapsed);
		m_pTailRotorFrame->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate, m_pTailRotorFrame->m_xmf4x4ToParent);
	}

	CGameObject::Animate(fTimeElapsed);
	if (SphereCollider)SphereCollider->SetPosition(GetPosition());
	if (SphereCollider)SphereCollider->m_xmf4x4ToParent = Matrix4x4::Multiply(XMMatrixScaling(5, 5, 5), m_xmf4x4ToParent);
	if (SphereCollider)SphereCollider->Animate(fTimeElapsed, GetPosition());

	GET_MANAGER<AIManager>()->DoAction(AI_AIRCRAFT, this);
}

void CSuperCobraObject::CollisionActivate(CGameObject* collideTarget)
{
	cout << "Ãæµ¹!" << endl;
	m_isDead = true;
	m_pUI->m_isDead = true;
	m_pLockOnUI->m_isDead = true;
}

void CSuperCobraObject::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	//if (SphereCollider)SphereCollider->Render(pd3dCommandList, pCamera);
	CGameObject::Render(pd3dCommandList, pCamera);
}
