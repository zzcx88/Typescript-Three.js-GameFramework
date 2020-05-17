#include "stdafx.h"
#include "CMissle.h"
#include "CMissleFog.h"
#include "ObjectManager.h"
#include "CMissleSplash.h"

CMissle::CMissle(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, CLoadedModelInfo* pSphereModel, XMFLOAT3* xmfTarget, XMFLOAT3 xmfLunchPosition, ObjectManager* pObjectManager)
{
	m_xmfTarget = xmfTarget;
	m_xmfLunchPosition = xmfLunchPosition;
	SphereCollider = new CSphereCollider(pSphereModel);
	//SphereCollider->SetScale(100, 100, 100);
	SphereCollider->SetSphereCollider(GetPosition(), 5.f);
	m_pd3dDevice = pd3dDevice;
	m_pd3dCommandList = pd3dCommandList;
	m_pd3dGraphicsRootSignature = pd3dGraphicsRootSignature;

	m_ObjManager = pObjectManager;

	CreateShaderVariables(pd3dDevice, pd3dCommandList);
	//cout << m_xmfTarget->y << endl;
}

CMissle::~CMissle()
{
}

void CMissle::Animate(float fTimeElapsed)
{
	m_fAddFogTimeElapsed += fTimeElapsed;
	m_fDeleteTimeElapsed += fTimeElapsed;

	m_xmf3Position.x = m_xmf4x4ToParent._41;
	m_xmf3Position.y = m_xmf4x4ToParent._42;
	m_xmf3Position.z = m_xmf4x4ToParent._43;
	
	if (FirstFire)
	{
		FirstFire = false;
	}
	
	if (m_fDeleteTimeElapsed > m_fDeleteFrequence)
	{
		m_isDead = true;
	}

	//if(m_bLockOn == true)
  	SetLookAt(fTimeElapsed);

 	Move(DIR_FORWARD, 1500.0f * fTimeElapsed, false);
	CGameObject::Animate(fTimeElapsed);
	if (SphereCollider)SphereCollider->SetPosition(GetPosition());
	if (SphereCollider)SphereCollider->m_xmf4x4ToParent = Matrix4x4::Multiply(XMMatrixScaling(10, 10, 10), m_xmf4x4ToParent);
	if (SphereCollider)SphereCollider->Animate(fTimeElapsed, GetPosition());

	if (m_fAddFogTimeElapsed > m_fAddFogFrequence)
	{
		CMissleFog* pMissleFog;
		pMissleFog = new CMissleFog();
		pMissleFog->m_pCamera = m_pCamera;
		pMissleFog->SetMesh(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pPlaneMesh);
		//머테리얼을 새로 동적할당 할 것이기 때문에 사용할 텍스쳐 갯수만큼 래퍼런스 오브젝트로부터 텍스쳐를 불러온다
		for(int i = 0; i < 10; ++i)
			pMissleFog->m_pEffectTexture[i] = m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pEffectTexture[i];
		//머테리얼을 새로 동적할당 하지 않으면 래퍼런스 오브젝트를 직접 건드리게 되어 애니메이션에 차질이 생긴다.
		pMissleFog->m_pEffectMaterial = new CMaterial(1);
		pMissleFog->m_pEffectMaterial->SetTexture(pMissleFog->m_pEffectTexture[0]);
		pMissleFog->m_pEffectMaterial->SetShader(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_EffectShader);
		pMissleFog->SetMaterial(0, pMissleFog->m_pEffectMaterial);
		pMissleFog->SetPosition(m_xmf3Position);
		m_ObjManager->AddObject(L"MissleFogInstance", pMissleFog, OBJ_EFFECT);

		m_fAddFogTimeElapsed = 0;
	}
}

void CMissle::CollisionActivate(CGameObject* collideTarget)
{
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
	GET_MANAGER<ObjectManager>()->AddObject(L"MissleSplashInstance", pMissleSplash, OBJ_EFFECT);

	m_isDead = true;
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
	if (pxmf3Axis->x == 0 && pxmf3Axis->y == 0 && pxmf3Axis->z == 0)
	{
		cout << "zero" << endl;
		return;
	}

	XMMATRIX xmmtxRotate = XMMatrixRotationAxis(XMLoadFloat3(pxmf3Axis), XMConvertToRadians(fAngle));
	m_xmf3Look = Vector3::TransformNormal(m_xmf3Look, xmmtxRotate);
	m_xmf3Up = Vector3::TransformNormal(m_xmf3Up, xmmtxRotate);

	m_xmf4x4ToParent._31 = m_xmf3Look.x * 10;
	m_xmf4x4ToParent._32 = m_xmf3Look.y * 10;
	m_xmf4x4ToParent._33 = m_xmf3Look.z * 10;

	m_xmf4x4ToParent._21 = m_xmf3Up.x * 10;
	m_xmf4x4ToParent._22 = m_xmf3Up.y * 10;
	m_xmf4x4ToParent._23 = m_xmf3Up.z * 10;

	m_xmf3Look = Vector3::Normalize(m_xmf3Look);
	m_xmf3Right = Vector3::CrossProduct(m_xmf3Up, m_xmf3Look, true);
	m_xmf3Up = Vector3::CrossProduct(m_xmf3Look, m_xmf3Right, true);

	m_xmf4x4ToParent._11 = m_xmf3Right.x * 10;
	m_xmf4x4ToParent._12 = m_xmf3Right.y * 10;
	m_xmf4x4ToParent._13 = m_xmf3Right.z * 10;
}


void CMissle::SetLookAt(float fTimeElapsed)
{
	float theta = 50.f * fTimeElapsed;
	{
		XMFLOAT3 xmf3TargetVector = Vector3::Subtract(*m_xmfTarget, m_xmf3Position);
		xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
		XMFLOAT3 xmfAxis = Vector3::CrossProduct(m_xmf3Look, xmf3TargetVector);
		xmfAxis = Vector3::Normalize(xmfAxis);

		float Lenth = sqrt(xmf3TargetVector.x * xmf3TargetVector.x + xmf3TargetVector.y * xmf3TargetVector.x + xmf3TargetVector.z * xmf3TargetVector.z);
		XMFLOAT3 LenthXYZ = Vector3::Subtract(*m_xmfTarget, m_xmfLunchPosition);
		float LenthZ = sqrt(LenthXYZ.z * LenthXYZ.z);
		Rotate(&xmfAxis, theta);
		//CGameObject::Rotate(xmfHoming.x * 100 * fTimeElapsed, xmfHoming.y * 100 * fTimeElapsed, 0);

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
