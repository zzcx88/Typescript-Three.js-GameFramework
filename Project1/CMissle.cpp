#include "stdafx.h"
#include "CMissle.h"

CMissle::CMissle(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, CLoadedModelInfo* pSphereModel, XMFLOAT3* xmfTarget, XMFLOAT3 xmfLunchPosition)
{
	m_xmfTarget = xmfTarget;
	m_xmfLunchPosition = xmfLunchPosition;
	SphereCollider = new CSphereCollider(pSphereModel);
	SphereCollider->SetScale(1, 1, 1);
	SphereCollider->SetSphereCollider(GetPosition(), 10.0f);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);
	//cout << m_xmfTarget->y << endl;
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
		/*m_xmf3TargetVector = Vector3::Subtract(*m_xmfTarget, m_xmfLunchPosition);
		m_xmf3TargetVector = Vector3::Normalize(m_xmf3TargetVector);
		m_xmfAxis = Vector3::CrossProduct(m_xmf3Look, m_xmf3TargetVector);
		m_xmfAxis = Vector3::Normalize(m_xmfAxis);*/
		FirstFire = false;
	}
	
	SetLookAt(fTimeElapsed);
	Move(DIR_FORWARD, 1500.0f * fTimeElapsed, false);
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

void CMissle::Rotate(XMFLOAT3* pxmf3Axis, float fAngle)
{
	XMMATRIX xmmtxRotate = XMMatrixRotationAxis(XMLoadFloat3(pxmf3Axis), XMConvertToRadians(fAngle));
	m_xmf3Look = Vector3::TransformNormal(m_xmf3Look, xmmtxRotate);
	m_xmf3Up = Vector3::TransformNormal(m_xmf3Up, xmmtxRotate);

	m_xmf3Look = Vector3::Normalize(m_xmf3Look);
	m_xmf3Right = Vector3::CrossProduct(m_xmf3Up, m_xmf3Look, true);
	m_xmf3Up = Vector3::CrossProduct(m_xmf3Look, m_xmf3Right, true);
}


void CMissle::SetLookAt(float fTimeElapsed)
{
	float theta = 200 * fTimeElapsed;
	{
		XMFLOAT3 xmf3TargetVector = Vector3::Subtract(*m_xmfTarget, m_xmfLunchPosition);
		xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
		XMFLOAT3 xmfAxis = Vector3::CrossProduct(m_xmf3Look, xmf3TargetVector);
		xmfAxis = Vector3::Normalize(xmfAxis);
		XMFLOAT3 xmfHoming;
		xmfHoming.x = xmfAxis.x * theta;
		xmfHoming.y = xmfAxis.y * theta;
		xmfHoming.z = xmfAxis.z * theta;
		float Lenth = sqrt(xmf3TargetVector.x * xmf3TargetVector.x + xmf3TargetVector.y * xmf3TargetVector.x + xmf3TargetVector.z * xmf3TargetVector.z);
		XMFLOAT3 LenthXYZ = Vector3::Subtract(*m_xmfTarget, m_xmfLunchPosition);
		float LenthZ = sqrt(LenthXYZ.z * LenthXYZ.z);
		Rotate(&xmfAxis, theta);
		CGameObject::Rotate(xmfHoming.x * 100 * fTimeElapsed, xmfHoming.y * 100 * fTimeElapsed, 0);
	}
	//else if (m_xmfLunchPosition.z < m_xmfTarget->z)
	//{
	//	XMFLOAT3 xmf3TargetVector = Vector3::Subtract(*m_xmfTarget, m_xmfLunchPosition);
	//	xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
	//	XMFLOAT3 xmfAxis = Vector3::CrossProduct(m_xmf3Look, xmf3TargetVector);
	//	xmfAxis = Vector3::Normalize(xmfAxis);
	//	XMFLOAT3 xmfHoming;
	//	xmfHoming.x = xmfAxis.x * theta;
	//	xmfHoming.y = xmfAxis.y * theta;
	//	xmfHoming.z = xmfAxis.z * theta;
	//	float Lenth = sqrt(xmf3TargetVector.x * xmf3TargetVector.x + xmf3TargetVector.y * xmf3TargetVector.x + xmf3TargetVector.z * xmf3TargetVector.z);
	//	XMFLOAT3 LenthXYZ = Vector3::Subtract(*m_xmfTarget, m_xmfLunchPosition);
	//	float LenthZ = sqrt(LenthXYZ.z * LenthXYZ.z);
	//	//Rotate(xmfHoming.x, xmfHoming.y, 0);
	//	Rotate(&xmfAxis, theta);
	//	CGameObject::Rotate(xmfHoming.x * 100 * fTimeElapsed, xmfHoming.y * 100 * fTimeElapsed, 0);
	//}


	//if (m_xmfLunchPosition.z > m_xmfTarget->z)
	//{
	//	XMFLOAT3 xmf3TargetVector = Vector3::Subtract(*m_xmfTarget, m_xmf3Position);
	//	xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
	//	XMFLOAT3 xmfAxis = Vector3::CrossProduct(m_xmf3Look, xmf3TargetVector);
	//	xmfAxis = Vector3::Normalize(xmfAxis);
	//	XMFLOAT3 xmfHoming;
	//	xmfHoming.x = xmfAxis.x * theta;
	//	xmfHoming.y = xmfAxis.y * theta;
	//	xmfHoming.z = xmfAxis.z * theta;
	//	float Lenth = sqrt(xmf3TargetVector.x * xmf3TargetVector.x + xmf3TargetVector.y * xmf3TargetVector.x + xmf3TargetVector.z * xmf3TargetVector.z);
	//	XMFLOAT3 LenthXYZ = Vector3::Subtract(*m_xmfTarget, m_xmfLunchPosition);
	//	float LenthZ = sqrt(LenthXYZ.z * LenthXYZ.z);
	//	if (LenthZ < 200)
	//	{
	//		if (SamePosY == true)
	//		{
	//			Rotate(0, xmfHoming.y, 0);
	//			CGameObject::Rotate(xmfHoming.x * 100 * fTimeElapsed, xmfHoming.y * 100 * fTimeElapsed, 0);
	//			return;
	//		}
	//		if (m_xmf3Position.y < m_xmfTarget->y)
	//		{
	//			if (xmfHoming.x < 0)
	//			{
	//				xmfHoming.x *= -1;
	//			}
	//			Rotate(-xmfHoming.x * 1000 * fTimeElapsed, xmfHoming.y, 0);
	//			CGameObject::Rotate(xmfHoming.x * 100 * fTimeElapsed, xmfHoming.y * 100 * fTimeElapsed, 0);
	//		}
	//		else if (m_xmf3Position.y > m_xmfTarget->y)
	//		{
	//			if (xmfHoming.x > 0)
	//			{
	//				xmfHoming.x *= -1;
	//			}
	//			Rotate(-xmfHoming.x * 1000 * fTimeElapsed, xmfHoming.y, 0);
	//			CGameObject::Rotate(xmfHoming.x * 100 * fTimeElapsed, xmfHoming.y * 100 * fTimeElapsed, 0);
	//		}
	//		if ((m_xmf3Position.y - m_xmfTarget->y < 5 && m_xmfTarget->y - m_xmf3Position.y > -5) && Lenth < 100)
	//		{
	//			SamePosY = true;
	//		}
	//	}
	//	else
	//	{
	//		Rotate(-xmfHoming.x, xmfHoming.y, 0);
	//		CGameObject::Rotate(-xmfHoming.x * 100 * fTimeElapsed, xmfHoming.y * 100 * fTimeElapsed, 0);
	//	}
	//	std::cout << "X : " << xmf3TargetVector.x <<  " Y :  " << xmf3TargetVector.y << " Z : " << xmf3TargetVector.z << endl;
	//}
	//else if (m_xmfLunchPosition.z < m_xmfTarget->z)
	//{
	//	XMFLOAT3 xmf3TargetVector = Vector3::Subtract(*m_xmfTarget, m_xmf3Position);
	//	//xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
	//	XMFLOAT3 xmfAxis = Vector3::CrossProduct(m_xmf3Look, xmf3TargetVector, false);
	//	xmfAxis = Vector3::Normalize(xmfAxis);
	//	XMFLOAT3 xmfHoming;
	//	xmfHoming.x = xmfAxis.x * theta;
	//	xmfHoming.y = xmfAxis.y * theta;
	//	xmfHoming.z = xmfAxis.z * theta;
	//	float Lenth = sqrt(xmf3TargetVector.x * xmf3TargetVector.x + xmf3TargetVector.y * xmf3TargetVector.x + xmf3TargetVector.z * xmf3TargetVector.z);
	//	XMFLOAT3 LenthXYZ = Vector3::Subtract(*m_xmfTarget, m_xmfLunchPosition);
	//	float LenthZ = sqrt(LenthXYZ.z * LenthXYZ.z);
	//	if (LenthZ < 200)
	//	{
	//		if (SamePosY == true)
	//		{
	//			Rotate(0, xmfHoming.y, 0);
	//			CGameObject::Rotate(xmfHoming.x * 100 * fTimeElapsed, xmfHoming.y * 100 * fTimeElapsed, 0);
	//			return;
	//		}
	//		if(m_xmf3Position.y <  m_xmfTarget->y)
	//		{
	//			if (xmfHoming.x < 0)
	//			{
	//				xmfHoming.x *= -1;
	//			}
	//			Rotate(-xmfHoming.x * 1000 * fTimeElapsed, xmfHoming.y, 0);
	//			CGameObject::Rotate(xmfHoming.x * 100 * fTimeElapsed, xmfHoming.y * 100 * fTimeElapsed, 0);
	//		}
	//		else if (m_xmf3Position.y > m_xmfTarget->y)
	//		{
	//			if (xmfHoming.x > 0)
	//			{
	//				xmfHoming.x *= -1;
	//			}
	//			Rotate(-xmfHoming.x * 1000 * fTimeElapsed, xmfHoming.y, 0);
	//			CGameObject::Rotate(xmfHoming.x * 100 * fTimeElapsed, xmfHoming.y * 100 * fTimeElapsed, 0);
	//		}
	//		if ((m_xmf3Position.y - m_xmfTarget->y < 5 && m_xmfTarget->y - m_xmf3Position.y > -5) && Lenth < 100)
	//		{
	//			SamePosY = true;
	//		}
	//	}
	//	else
	//	{
	//		Rotate(xmfHoming.x, xmfHoming.y, 0);
	//		CGameObject::Rotate(xmfHoming.x * 100 * fTimeElapsed, xmfHoming.y * 100 * fTimeElapsed, 0);
	//	}
	//}


	/*float theta = 10.0f * fTimeElapsed;
	XMFLOAT3 xmf3TargetVector = Vector3::Subtract(m_xmf3Position, *m_xmfTarget);
	xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
	XMFLOAT3 xmfAxis = Vector3::CrossProduct(xmf3TargetVector, m_xmf3Look);
	XMFLOAT3 xmfHoming;
	xmfHoming.x = xmfAxis.x * theta;
	xmfHoming.y = xmfAxis.y * theta;
	xmfHoming.z = xmfAxis.z * theta;
	XMFLOAT3 xmfUp(1.0f, 0.0f, 0.0f);
	XMFLOAT4X4 mtxLookAt = Matrix4x4::LookAtLH(m_xmf3Position, *m_xmfTarget, xmfUp);
	m_xmf3Up = XMFLOAT3(mtxLookAt._12, mtxLookAt._22, mtxLookAt._32);
	m_xmf3Look = XMFLOAT3(mtxLookAt._13, mtxLookAt._23, mtxLookAt._33);
	Rotate(xmfHoming.x, xmfHoming.y, xmfHoming.z);
	m_xmf4x4World._11 = xmfHoming.x;			m_xmf4x4World._12 = xmfHoming.y;		m_xmf4x4World._13 = xmfHoming.z;
	m_xmf4x4World._21 = m_xmf3Up.x;			m_xmf4x4World._22 = m_xmf3Up.y;		m_xmf4x4World._23 = m_xmf3Up.z;
	m_xmf4x4World._31 = m_xmf3Look.x;		m_xmf4x4World._32 = m_xmf3Look.y;	m_xmf4x4World._33 = m_xmf3Look.z;*/
}

void CMissle::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	//if (SphereCollider)SphereCollider->Render(pd3dCommandList, pCamera);
	CGameObject::Render(pd3dCommandList, pCamera);
}
