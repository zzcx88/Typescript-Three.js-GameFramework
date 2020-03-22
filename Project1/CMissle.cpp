#include "stdafx.h"
#include "CMissle.h"

CMissle::CMissle(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, CLoadedModelInfo* pSphereModel, XMFLOAT3& xmfTarget)
{
	m_xmfTarget = xmfTarget;
	SphereCollider = new CSphereCollider(pSphereModel);
	SphereCollider->SetScale(1, 1, 1);
	SphereCollider->SetSphereCollider(GetPosition(), 10.0f);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);
}

CMissle::~CMissle()
{
}

void CMissle::Animate(float fTimeElapsed)
{
	m_xmf3Position.x = m_xmf4x4ToParent._41;
	m_xmf3Position.y = m_xmf4x4ToParent._42;
	m_xmf3Position.z = m_xmf4x4ToParent._43;
	
	if (FirstFire)
	{
		/*XMFLOAT3 xmfUp(0.0f, 1.0f, 0.0f);
		XMFLOAT3 xmf3Position(m_xmf4x4ToParent._41, m_xmf4x4ToParent._42, m_xmf4x4ToParent._43);
		XMFLOAT3 xmf3Look = (Vector3::Subtract(m_xmfTarget, xmf3Position));
		XMFLOAT3 xmf3Right = (Vector3::CrossProduct(xmfUp, xmf3Look));
		m_xmf4x4ToParent._11 = m_xmf3Right.x; m_xmf4x4ToParent._12 = m_xmf3Right.y; m_xmf4x4ToParent._13 = m_xmf3Right.z;
		m_xmf4x4ToParent._21 = m_xmf3Up.x;		  m_xmf4x4ToParent._22 = m_xmf3Up.y;		m_xmf4x4ToParent._23 = m_xmf3Up.z;
		m_xmf4x4ToParent._31 = m_xmf3Look.x;  m_xmf4x4ToParent._32 = m_xmf3Look.y;  m_xmf4x4ToParent._33 = m_xmf3Look.z;*/
		FirstFire = false;
	}

	SetLookAt();
	Move(DIR_FORWARD, 1000.0f * fTimeElapsed, false);
	CGameObject::Animate(fTimeElapsed);
	if (SphereCollider)SphereCollider->SetPosition(GetPosition());
	if (SphereCollider)SphereCollider->m_xmf4x4ToParent = Matrix4x4::Multiply(XMMatrixScaling(1, 1, 1), m_xmf4x4ToParent);
	SphereCollider->SetScale(0.5, 0.5, 0.5);
	if (SphereCollider)SphereCollider->Animate(fTimeElapsed, GetPosition());
	//cout << SphereCollider->m_BoundingSphere.Center.z << endl;
}

void CMissle::Move(DWORD dwDirection, float fDistance, bool bUpdateVelocity)
{
	if (dwDirection)
	{
		XMFLOAT3 xmf3Shift = XMFLOAT3(0, 0, 0);
		if (dwDirection & DIR_FORWARD) xmf3Shift = Vector3::Add(xmf3Shift, m_xmf3Look, fDistance);
		if (dwDirection & DIR_BACKWARD) xmf3Shift = Vector3::Add(xmf3Shift, m_xmf3Look, -fDistance);
		if (dwDirection & DIR_RIGHT) xmf3Shift = Vector3::Add(xmf3Shift, m_xmf3Right, fDistance);
		if (dwDirection & DIR_LEFT) xmf3Shift = Vector3::Add(xmf3Shift, m_xmf3Right, -fDistance);
		if (dwDirection & DIR_UP) xmf3Shift = Vector3::Add(xmf3Shift, m_xmf3Up, fDistance);
		if (dwDirection & DIR_DOWN) xmf3Shift = Vector3::Add(xmf3Shift, m_xmf3Up, -fDistance);

		Move(xmf3Shift, bUpdateVelocity);
	}
}

void CMissle::Move(const XMFLOAT3& xmf3Shift, bool bUpdateVelocity)
{
	if (bUpdateVelocity)
	{
		m_xmf3Velocity = Vector3::Add(m_xmf3Velocity, xmf3Shift);
	}
	else
	{
		m_xmf3Position = Vector3::Add(m_xmf3Position, xmf3Shift);
		SetPosition(m_xmf3Position);
	}
}

void CMissle::SetLookAt()
{
	XMFLOAT3 xmf3TargetVector = Vector3::Subtract(m_xmf3Position, m_xmfTarget);
	XMFLOAT3 xmfAxis = Vector3::CrossProduct(xmf3TargetVector, m_xmf3Look);
	XMFLOAT3 xmfHoming;
	Rotate();
	/*XMFLOAT3 xmfUp(1.0f, 0.0f, 0.0f);
	XMFLOAT3 xmf3Position(m_xmf4x4ToParent._41, m_xmf4x4ToParent._42, m_xmf4x4ToParent._43);
	XMFLOAT4X4 mtxLookAt = Matrix4x4::LookAtLH(xmf3Position, m_xmfTarget, xmfUp);
	m_xmf3Right = XMFLOAT3(mtxLookAt._11, mtxLookAt._21, mtxLookAt._31);
	m_xmf3Up = XMFLOAT3(mtxLookAt._12, mtxLookAt._22, mtxLookAt._32);
	m_xmf3Look = XMFLOAT3(mtxLookAt._13, mtxLookAt._23, mtxLookAt._33);
	m_xmf4x4World._11 = m_xmf3Right.x ;		m_xmf4x4World._12 = m_xmf3Right.y;	m_xmf4x4World._13 = m_xmf3Right.z;
	m_xmf4x4ToParent._21 = m_xmf3Up.x;			m_xmf4x4ToParent._22 = m_xmf3Up.y;		m_xmf4x4ToParent._23 = m_xmf3Up.z;
	m_xmf4x4ToParent._31 = m_xmf3Look.x;		m_xmf4x4ToParent._32 = m_xmf3Look.y;	m_xmf4x4ToParent._33 = m_xmf3Look.z;*/
}

void CMissle::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	//if (SphereCollider)SphereCollider->Render(pd3dCommandList, pCamera);
	CGameObject::Render(pd3dCommandList, pCamera);
}
