#include "stdafx.h"
#include "CSuperCobraObject.h"
#include "CUI.h"

CSuperCobraObject::CSuperCobraObject(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature)
{
	p052C = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature, "Model/052C.bin", NULL, MODEL_STD);
	SphereCollider = new CSphereCollider(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	SphereCollider->SetScale(10, 10, 10);
	SphereCollider->SetSphereCollider(GetPosition(), 10.0f);

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

void CSuperCobraObject::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	if (SphereCollider)SphereCollider->Render(pd3dCommandList, pCamera);
	CGameObject::Render(pd3dCommandList, pCamera);
}
