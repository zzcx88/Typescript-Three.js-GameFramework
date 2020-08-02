#include "stdafx.h"
#include "CMissle.h"
#include "CMissleFog.h"
#include "ObjectManager.h"
#include "CMissleSplash.h"

CMissle::CMissle(CGameObject* pObj)
{
	m_bRefference = false;

	m_ObjManager = GET_MANAGER<ObjectManager>();
	m_pModelInfo = m_ObjManager->GetObjFromTag(L"missleRef", OBJ_ALLYMISSLE)->m_pModelInfo;
	CLoadedModelInfo* pMissleModelCol = m_ObjManager->GetObjFromTag(L"missleRef", OBJ_ALLYMISSLE)->m_pMissleModelCol;

	SetChild(m_pModelInfo->m_pModelRootObject);

	m_pCamera = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera;

	SphereCollider = new CSphereCollider(pMissleModelCol);
	SphereCollider->SetSphereCollider(GetPosition(), 5.f);

	m_xmfLunchPosition = pObj->m_xmf3Position;
	m_xmf3Look = pObj->GetLook();

	m_xmf4x4ToParent = Matrix4x4::Multiply(XMMatrixScaling(1, 1, 1), pObj->m_xmf4x4ToParent);
	SetScale(10.f, 10.f, 10.f);

	if (m_bLaunchFromShip == true)
	{
		m_fAssertFrequence = 6.f;
	}
}

CMissle::CMissle(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, XMFLOAT3* xmfTarget, XMFLOAT3 xmfLunchPosition, ObjectManager* pObjectManager)
{
	m_bRefference = true;
	m_pModelInfo = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature, "Model/Missle.bin", NULL, MODEL_ACE);
	m_pMissleModelCol = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature, "Model/Sphere.bin", NULL, MODEL_COL);

	m_xmfTarget = xmfTarget;
	//m_xmfLunchPosition = xmfLunchPosition;
	SphereCollider = new CSphereCollider(m_pMissleModelCol);
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
	if (m_bRefference == false)
	{
		m_fAddFogTimeElapsed += fTimeElapsed;
		m_fDeleteTimeElapsed += 1.2f * fTimeElapsed;

		m_xmf3Position.x = m_xmf4x4ToParent._41;
		m_xmf3Position.y = m_xmf4x4ToParent._42;
		m_xmf3Position.z = m_xmf4x4ToParent._43;

		if (FirstFire)
		{
			FirstFire = false;
		}

		if (m_xmfTarget == GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPositionForMissle())
		{
			GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_AiMissleAssert = true;
		}

		if (m_fDeleteTimeElapsed > m_fAssertFrequence && (m_bLaunchFromAircraft == true || m_bLaunchFromShip == true))
		{
			XMFLOAT3 xmf3TargetVector = Vector3::Subtract(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition(), GetPosition());
			xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
			float xmfAxis = Vector3::DotProduct(GetLook(), xmf3TargetVector);
			if ((xmfAxis > 0.5f || xmfAxis < -0.5f) && xmfAxis > 0.f)
			{
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_AiMissleAssert = false;
			}
		}

		if (m_fDeleteTimeElapsed > 0.5f && m_bShipMissleTurn == false && m_bLaunchFromShip == true)
		{
			m_bShipMissleTurn = true;
			XMFLOAT4X4 mtxLookAt = Matrix4x4::LookAtLH(GetPosition(), GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition(), GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_xmf3Up);
			m_xmf3Right = XMFLOAT3(mtxLookAt._11, mtxLookAt._21, mtxLookAt._31);
			m_xmf3Up = XMFLOAT3(mtxLookAt._12, mtxLookAt._22, mtxLookAt._32);
			m_xmf3Look = XMFLOAT3(mtxLookAt._13, mtxLookAt._23, mtxLookAt._33);
		}

		if (m_fDeleteTimeElapsed > m_fDeleteFrequence)
		{
			m_isDead = true;
			if (m_bLaunchFromAircraft == true || m_bLaunchFromShip == true)
			{
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_AiMissleAssert = false;
				GET_MANAGER<SoundManager>()->StopSound(CH_EFFECT);
			}
		}

		if (m_bLockOn == true)
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
			pMissleFog->m_fBurnerBlendAmount = 0.8f;
			pMissleFog->m_pCamera = m_pCamera;
			pMissleFog->SetMesh(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pPlaneMesh);
			//머테리얼을 새로 동적할당 할 것이기 때문에 사용할 텍스쳐 갯수만큼 래퍼런스 오브젝트로부터 텍스쳐를 불러온다
			//for(int i = 0; i < 5; ++i)
			//	pMissleFog->m_pEffectTexture[i] = m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pEffectTexture[i];
			//머테리얼을 새로 동적할당 하지 않으면 래퍼런스 오브젝트를 직접 건드리게 되어 애니메이션에 차질이 생긴다.
			pMissleFog->m_pEffectMaterial = new CMaterial(1);
			std::default_random_engine dre(time(NULL) * fTimeElapsed);
			std::uniform_int_distribution<int> index(0, 1);
			pMissleFog->m_pEffectMaterial->SetTexture(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pEffectTexture[0]);
			pMissleFog->m_pEffectMaterial->SetShader(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_EffectShader);
			pMissleFog->SetMaterial(0, pMissleFog->m_pEffectMaterial);
			pMissleFog->SetPosition(m_xmf3Position);
			pMissleFog->m_bEffectedObj = true;
			m_ObjManager->AddObject(L"MissleFogInstance", pMissleFog, OBJ_EFFECT);

			m_fAddFogTimeElapsed = 0;
		}

		if (GET_MANAGER<ObjectManager>()->GetTagFromObj(this, OBJ_ALLYMISSLE) == L"player_missle" && m_bMissleLockCamera == true && m_bLockOn == true)
		{
			if (m_bCameraPlayed == false)
			{
				GET_MANAGER<SoundManager>()->PlaySound(L"CameraMissle.mp3", CH_EFFECT);
				m_bCameraPlayed = true;
			}

			GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bEye_fixation = false;
			if (m_xmfTarget != NULL)
				m_pCamera->SetLookAt(XMFLOAT3(*m_xmfTarget));
			else
				m_pCamera->SetLookVector(GetLook());
			m_pCamera->SetPosition(XMFLOAT3(GetPosition().x - m_pCamera->GetLookVector().x * 100, GetPosition().y + 1.3 - m_pCamera->GetLookVector().y * 100,
				GetPosition().z - m_pCamera->GetLookVector().z * 100));
			m_pCamera->GenerateProjectionMatrix(1.01f, 100000.0f, ASPECT_RATIO, 20);
			m_pCamera->RegenerateViewMatrix();
		}
		else
		{
			GET_MANAGER<SoundManager>()->StopSound(CH_EFFECT);
		}
	}
}

void CMissle::CollisionActivate(CGameObject* collideTarget)
{
	if (m_bRefference == false && collideTarget->m_bDestroyed == false)
	{
		GET_MANAGER<SoundManager>()->PlaySound(L"SplashNormal.mp3", CH_SPLASH);

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
		//GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui29_score_number", OBJ_UI)->m_nPlayerScore += 50;

		if (GET_MANAGER<ObjectManager>()->GetTagFromObj(this, OBJ_ALLYMISSLE) == L"player_missle" && m_bMissleLockCamera == true)
		{
			GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bEye_fixation = true;
		}
		m_isDead = true;
		if (m_bLaunchFromAircraft == true || m_bLaunchFromShip == true)
		{
			GET_MANAGER<SoundManager>()->StopSound(CH_EFFECT);
			GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_AiMissleAssert = false;
		}
	}
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
	/*if (pxmf3Axis->x == 0 && pxmf3Axis->y == 0 && pxmf3Axis->z == 0)
	{
		cout << "zero" << endl;
		return;
	}

	XMMATRIX xmmtxRotate = XMMatrixRotationAxis(XMLoadFloat3(pxmf3Axis), XMConvertToRadians(fAngle));
	m_xmf3Look = Vector3::TransformNormal(m_xmf3Look, xmmtxRotate);
	m_xmf3Up = Vector3::TransformNormal(m_xmf3Up, xmmtxRotate);

	m_xmf3Look = Vector3::Normalize(m_xmf3Look);
	m_xmf3Right = Vector3::CrossProduct(m_xmf3Up, m_xmf3Look, true);
	m_xmf3Up = Vector3::CrossProduct(m_xmf3Look, m_xmf3Right, true);*/

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
	float fTheta = m_fTheta * fTimeElapsed;
	{
		XMFLOAT3 xmf3TargetVector = Vector3::Subtract(*m_xmfTarget, m_xmf3Position);
		xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
		XMFLOAT3 xmfAxis = Vector3::CrossProduct(m_xmf3Look, xmf3TargetVector);
		xmfAxis = Vector3::Normalize(xmfAxis);

		LenthToPlayer = Vector3::Length(xmf3TargetVector);
		XMFLOAT3 LenthXYZ = Vector3::Subtract(*m_xmfTarget, m_xmfLunchPosition);
		float LenthZ = sqrt(LenthXYZ.z * LenthXYZ.z);

		float xmfAxis1 = Vector3::DotProduct(GetLook(), xmf3TargetVector);
		Rotate(&xmfAxis, fTheta);
		//cout << xmfAxis.x << " " << xmfAxis.y << " " << xmfAxis.z << endl;
		//cout << xmfAxis1 << endl;
	}
}

void CMissle::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	if (m_bRefference == false)
	{
		//if (SphereCollider)SphereCollider->Render(pd3dCommandList, pCamera);
		CGameObject::Render(pd3dCommandList, pCamera);
	}
}
