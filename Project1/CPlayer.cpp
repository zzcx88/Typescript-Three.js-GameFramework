#include "stdafx.h"
#include "CHeightMapTerrain.h"
#include "CAfterBurner.h"
#include "CPlayer.h"

CPlayer::CPlayer()
{
	m_pCamera = NULL;

	m_xmf3Position = XMFLOAT3(0.0f, 0.0f, 0.0f);
	m_xmf3Right = XMFLOAT3(1.0f, 0.0f, 0.0f);
	m_xmf3Up = XMFLOAT3(0.0f, 1.0f, 0.0f);
	m_xmf3Look = XMFLOAT3(0.0f, 0.0f, 1.0f);

	m_xmf3Velocity = XMFLOAT3(0.0f, 0.0f, 0.0f);
	m_xmf3Gravity = XMFLOAT3(0.0f, 0.0f, 0.0f);
	m_fMaxVelocityXZ = 0.0f;
	m_fMaxVelocityY = 0.0f;
	m_fFriction = 0.0f;

	m_fPitch = 0.0f;
	m_fRoll = 0.0f;
	m_fYaw = 0.0f;

	m_pPlayerUpdatedContext = NULL;
	m_pCameraUpdatedContext = NULL;
}

CPlayer::~CPlayer()
{
	ReleaseShaderVariables();

	if (m_pCamera) delete m_pCamera;
}

void CPlayer::CreateShaderVariables(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList)
{
	if (m_pCamera) m_pCamera->CreateShaderVariables(pd3dDevice, pd3dCommandList);
}

void CPlayer::UpdateShaderVariables(ID3D12GraphicsCommandList* pd3dCommandList)
{
}

void CPlayer::ReleaseShaderVariables()
{
	if (m_pCamera) m_pCamera->ReleaseShaderVariables();
}

void CPlayer::Move(DWORD dwDirection, float fDistance, bool bUpdateVelocity)
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

void CPlayer::Move(const XMFLOAT3& xmf3Shift, bool bUpdateVelocity)
{
	if (bUpdateVelocity)
	{
		m_xmf3Velocity = Vector3::Add(m_xmf3Velocity, xmf3Shift);
	}
	else
	{
		m_xmf3Position = Vector3::Add(m_xmf3Position, xmf3Shift);
		m_pCamera->Move(xmf3Shift);
	}
}

void CPlayer::Rotate(float x, float y, float z)
{
	DWORD nCurrentCameraMode = m_pCamera->GetMode();
	if ((nCurrentCameraMode == FIRST_PERSON_CAMERA) || (nCurrentCameraMode == THIRD_PERSON_CAMERA))
	{
		if (x != 0.0f)
		{
			m_fPitch += x;
			if (m_fPitch > +89.0f) { x -= (m_fPitch - 89.0f); m_fPitch = +89.0f; }
			if (m_fPitch < -89.0f) { x -= (m_fPitch + 89.0f); m_fPitch = -89.0f; }
		}
		if (y != 0.0f)
		{
			m_fYaw += y;
			if (m_fYaw > 360.0f) m_fYaw -= 360.0f;
			if (m_fYaw < 0.0f) m_fYaw += 360.0f;
		}
		if (z != 0.0f)
		{
			m_fRoll += z;
			if (m_fRoll > +20.0f) { z -= (m_fRoll - 20.0f); m_fRoll = +20.0f; }
			if (m_fRoll < -20.0f) { z -= (m_fRoll + 20.0f); m_fRoll = -20.0f; }
		}
		m_pCamera->Rotate(x, y, z);
		if (y != 0.0f)
		{
			XMMATRIX xmmtxRotate = XMMatrixRotationAxis(XMLoadFloat3(&m_xmf3Up), XMConvertToRadians(y));
			m_xmf3Look = Vector3::TransformNormal(m_xmf3Look, xmmtxRotate);
			m_xmf3Right = Vector3::TransformNormal(m_xmf3Right, xmmtxRotate);
		}
	}
	else if (nCurrentCameraMode == SPACESHIP_CAMERA)
	{
		m_pCamera->Rotate(x, y, z);
		if (x != 0.0f)
		{
			XMMATRIX xmmtxRotate = XMMatrixRotationAxis(XMLoadFloat3(&m_xmf3Right), XMConvertToRadians(x));
			m_xmf3Look = Vector3::TransformNormal(m_xmf3Look, xmmtxRotate);
			m_xmf3Up = Vector3::TransformNormal(m_xmf3Up, xmmtxRotate);
		}
		if (y != 0.0f)
		{
			XMMATRIX xmmtxRotate = XMMatrixRotationAxis(XMLoadFloat3(&m_xmf3Up), XMConvertToRadians(y));
			m_xmf3Look = Vector3::TransformNormal(m_xmf3Look, xmmtxRotate);
			m_xmf3Right = Vector3::TransformNormal(m_xmf3Right, xmmtxRotate);
		}
		if (z != 0.0f)
		{
			XMMATRIX xmmtxRotate = XMMatrixRotationAxis(XMLoadFloat3(&m_xmf3Look), XMConvertToRadians(z));
			m_xmf3Up = Vector3::TransformNormal(m_xmf3Up, xmmtxRotate);
			m_xmf3Right = Vector3::TransformNormal(m_xmf3Right, xmmtxRotate);
		}
	}

	m_xmf3Look = Vector3::Normalize(m_xmf3Look);
	m_xmf3Right = Vector3::CrossProduct(m_xmf3Up, m_xmf3Look, true);
	m_xmf3Up = Vector3::CrossProduct(m_xmf3Look, m_xmf3Right, true);
}

void CPlayer::Update_Input(const float& TimeDelta)
{
	KeyManager* keyManager = GET_MANAGER<KeyManager>();
	DWORD dwDirection = 0;
	
	if (true == keyManager->GetKeyState(STATE_DOWN, VK_TAB))
	{
		dwDirection |= VK_TAB;
		if(m_bEye_fixation == false)
		{
			m_bEye_fixation = true;
		}
		else
		{
			m_bEye_fixation = false;
		}

		if (m_bEye_fixation == false)
		{
			m_fFOV = 60;
			m_pCamera->GenerateProjectionMatrix(1.01f, m_fFarPlaneDistance, ASPECT_RATIO, m_fFOV);
			m_pCamera->SetLookPlayer();
			XMFLOAT3 xmf3Shift = XMFLOAT3(0, 0, 0);
			xmf3Shift = Vector3::Add(xmf3Shift, m_xmf3Up, 1);
			m_pCamera->SetPosition(Vector3::Add(m_xmf3Position, xmf3Shift));
			xmf3Shift = Vector3::Add(xmf3Shift, m_xmf3Look, -5);
			m_pCamera->SetPosition(Vector3::Add(m_xmf3Position, xmf3Shift));
		}
	}

	if (true == keyManager->GetKeyState(STATE_DOWN, VK_SPACE))
	{
		dwDirection |= VK_SPACE;
		MissleLaunch();
	}

	if (keyManager->GetKeyState(STATE_PUSH, VK_RIGHT) || keyManager->GetKeyState(STATE_PUSH, VK_LEFT))
	{
		if (true == keyManager->GetKeyState(STATE_PUSH, VK_RIGHT))
		{
			if (!(true == keyManager->GetKeyState(STATE_PUSH, VK_LEFT)))
			{
				dwDirection |= VK_RIGHT;
				Rotate(0.0f, 0.0f, -Roll_WingsRotateDegree * m_fRollPerformance * TimeDelta);
				RightRollAnimation(TimeDelta);
			}
			else
			{
				if (Roll_WingsRotateDegree != 0)
					Rotate(0.0f, 0.0f, -Roll_WingsRotateDegree * m_fRollPerformance * TimeDelta);
				RollWingReturn(TimeDelta);
			}
		}

		if (true == keyManager->GetKeyState(STATE_PUSH, VK_LEFT))
		{
			if (!(true == keyManager->GetKeyState(STATE_PUSH, VK_RIGHT)))
			{
				dwDirection |= VK_LEFT;
				Rotate(0.0f, 0.0f, -Roll_WingsRotateDegree * m_fRollPerformance * TimeDelta);
				LeftRollAnimation(TimeDelta);
			}
		}
	}
	else
	{
		if (Roll_WingsRotateDegree != 0)
			Rotate(0.0f, 0.0f, -Roll_WingsRotateDegree * m_fRollPerformance * TimeDelta);
		RollWingReturn(TimeDelta);
	}

	if (keyManager->GetKeyState(STATE_PUSH, VK_UP) || keyManager->GetKeyState(STATE_PUSH, VK_DOWN))
	{
		if (true == keyManager->GetKeyState(STATE_PUSH, VK_UP))
		{
			if (!(true == keyManager->GetKeyState(STATE_PUSH, VK_DOWN)))
			{
				dwDirection |= VK_UP;
				Rotate(Pitch_WingsRotateDegree * m_fPitchPerformance * TimeDelta, 0.0f, 0.0f);
				DownPitchAnimation(TimeDelta);
			}
			else
			{
				if (Pitch_WingsRotateDegree != 0)
					Rotate(Pitch_WingsRotateDegree * m_fPitchPerformance * TimeDelta, 0.0f, 0.0f);
				PitchWingReturn(TimeDelta);
			}
		}

		if (true == keyManager->GetKeyState(STATE_PUSH, VK_DOWN))
		{
			if (!(true == keyManager->GetKeyState(STATE_PUSH, VK_UP)))
			{
				dwDirection |= VK_DOWN;
				Rotate(Pitch_WingsRotateDegree * m_fPitchPerformance * TimeDelta, 0.0f, 0.0f);
				UpPitchAnimation(TimeDelta);
			}
		}
	}
	else
	{
		if (Pitch_WingsRotateDegree != 0)
			Rotate(Pitch_WingsRotateDegree * m_fPitchPerformance * TimeDelta, 0.0f, 0.0f);
		PitchWingReturn(TimeDelta);
	}


	if (keyManager->GetKeyState(STATE_PUSH, VK_Q) || keyManager->GetKeyState(STATE_PUSH, VK_E))
	{
		if (true == keyManager->GetKeyState(STATE_PUSH, VK_Q))
		{
			if (!(true == keyManager->GetKeyState(STATE_PUSH, VK_E)))
			{
				dwDirection |= VK_Q;
				Rotate(0.0f, Yaw_WingsRotateDegree * m_fYawPerformance * TimeDelta, 0.0f);
				LeftYawAnimation(TimeDelta);
			}
			else
			{
				if (Yaw_WingsRotateDegree != 0)
					Rotate(0.0f, Yaw_WingsRotateDegree * m_fYawPerformance * TimeDelta, 0.0f);
				YawWingReturn(TimeDelta);
			}
		}

		if (true == keyManager->GetKeyState(STATE_PUSH, VK_E))
		{
			if (!(true == keyManager->GetKeyState(STATE_PUSH, VK_Q)))
			{
				dwDirection |= VK_E;
				Rotate(0.0f, Yaw_WingsRotateDegree * m_fYawPerformance * TimeDelta, 0.0f);
				RightYawAnimation(TimeDelta);
			}
		}
	}
	else
	{
		if(Yaw_WingsRotateDegree != 0)
			Rotate(0.0f, Yaw_WingsRotateDegree * m_fYawPerformance * TimeDelta, 0.0f);
		YawWingReturn(TimeDelta);
	}


	if (keyManager->GetKeyState(STATE_PUSH, VK_W) || keyManager->GetKeyState(STATE_PUSH, VK_S))
	{
		if (true == keyManager->GetKeyState(STATE_PUSH, VK_W))
		{
			if (!(true == keyManager->GetKeyState(STATE_PUSH, VK_S)))
			{
				dwDirection |= VK_W;
				if (m_fAircraftSpeed < 1000)
				{
					m_fAircraftSpeed += 100 * TimeDelta;
				}
				if (m_fFOV < 70 && m_bEye_fixation == false)
				{
					m_pCamera->GenerateProjectionMatrix(1.01f, m_fFarPlaneDistance, ASPECT_RATIO, m_fFOV += 10.f * TimeDelta);
				}
				if (m_fBurnerElapsed < 100)
				{
					m_fBurnerElapsed += 100 * TimeDelta;
				}
			}
		}

		if (true == keyManager->GetKeyState(STATE_PUSH, VK_S))
		{
			dwDirection |= VK_S;
			if (m_fAircraftSpeed > 150)
			{
				m_fAircraftSpeed -= 150 * TimeDelta;
			}
			if (m_fFOV > 60)
			{
				m_pCamera->GenerateProjectionMatrix(1.01f, m_fFarPlaneDistance, ASPECT_RATIO, m_fFOV -= 20.f * TimeDelta);
			}
			if (m_fBurnerElapsed > 0)
			{
				m_fBurnerElapsed -= 100 * TimeDelta;
			}
		}
	}
	else
	{
		if (m_fAircraftSpeed > 200)
		{
			m_fAircraftSpeed -= 100 * TimeDelta;
		}
		if (m_fFOV > 60)
		{
			m_pCamera->GenerateProjectionMatrix(1.01f, m_fFarPlaneDistance, ASPECT_RATIO, m_fFOV -= 10.f * TimeDelta);
		}
		if (m_fBurnerElapsed > 0)
		{
			m_fBurnerElapsed -= 100 * TimeDelta;
		}

		if (m_fAircraftSpeed < 1000 && m_fAircraftSpeed > 200)
		{
			m_fAircraftSpeed -= 50 * TimeDelta;
		}
	}

	if (m_fAircraftSpeed >= 148 && m_fAircraftSpeed < 200)
	{
		if (m_fAircraftSpeed < 150)
		{
			m_fAircraftSpeed = 150;
		}
		m_fAircraftSpeed += 50 * TimeDelta;
	}

	if (m_fAircraftSpeed >= 148 && m_fAircraftSpeed < 200)
	{
		if (m_fAircraftSpeed < 150)
		{
			m_fAircraftSpeed = 150;
		}
		m_fAircraftSpeed += 50 * TimeDelta;
	}

	if (m_bEye_fixation == true)
	{
		m_pCamera->SetPosition(XMFLOAT3(GetPosition().x - m_pCamera->GetLookVector().x * 7, GetPosition().y + 1 - m_pCamera->GetLookVector().y * 7,
			GetPosition().z - m_pCamera->GetLookVector().z * 7));
		for (auto& Ene : m_ObjManager->GetObjFromType(OBJ_ENEMY))
		{
			if (Ene.second->bLockOnFire == true && Ene.second->GetState() != true)
			{
				XMFLOAT3 temp = Ene.second->GetPosition();
				//auto temp = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->GetPosition();
				m_pCamera->SetLookAt(XMFLOAT3(temp));
			}
		}
			if (m_fFOV > 40)
			{
				m_pCamera->GenerateProjectionMatrix(1.01f, m_fFarPlaneDistance, ASPECT_RATIO, m_fFOV);
				m_fFOV -= 30 * TimeDelta;
			}
	}

	Move(DIR_FORWARD, m_fAircraftSpeed * TimeDelta, true);
	//MoveForward(8.0f);
	WingAnimate(TimeDelta, dwDirection);

}

void CPlayer::Animate(float fTimeElapsed)
{
	m_xmf3Velocity = Vector3::Add(m_xmf3Velocity, Vector3::ScalarProduct(m_xmf3Gravity, fTimeElapsed, false));
	float fLength = sqrtf(m_xmf3Velocity.x * m_xmf3Velocity.x + m_xmf3Velocity.z * m_xmf3Velocity.z);
	float fMaxVelocityXZ = m_fMaxVelocityXZ * fTimeElapsed;
	if (fLength > m_fMaxVelocityXZ)
	{
		m_xmf3Velocity.x *= (fMaxVelocityXZ / fLength);
		m_xmf3Velocity.z *= (fMaxVelocityXZ / fLength);
	}
	float fMaxVelocityY = m_fMaxVelocityY * fTimeElapsed;
	fLength = sqrtf(m_xmf3Velocity.y * m_xmf3Velocity.y);
	if (fLength > m_fMaxVelocityY) m_xmf3Velocity.y *= (fMaxVelocityY / fLength);

	Move(m_xmf3Velocity, false);

	if (m_pPlayerUpdatedContext) OnPlayerUpdateCallback(fTimeElapsed);

	DWORD nCurrentCameraMode = m_pCamera->GetMode();
	if (nCurrentCameraMode == THIRD_PERSON_CAMERA) m_pCamera->Update(m_xmf3Position, fTimeElapsed);
	if (m_pCameraUpdatedContext) OnCameraUpdateCallback(fTimeElapsed);
	if (nCurrentCameraMode == THIRD_PERSON_CAMERA) m_pCamera->SetLookAt(m_xmf3Position);
	m_pCamera->RegenerateViewMatrix();

	fLength = Vector3::Length(m_xmf3Velocity);
	float fDeceleration = (m_fFriction * fTimeElapsed);
	if (fDeceleration > fLength) fDeceleration = fLength;
	m_xmf3Velocity = Vector3::Add(m_xmf3Velocity, Vector3::ScalarProduct(m_xmf3Velocity, -fDeceleration, true));

	Update_Input(fTimeElapsed);

	SetAfterBurnerPosition(fTimeElapsed);
	/*if (-1 ==Update_Input(fTimeElapsed))
	{
		return -1;
	}*/
}

CCamera* CPlayer::OnChangeCamera(DWORD nNewCameraMode, DWORD nCurrentCameraMode)
{
	CCamera* pNewCamera = NULL;
	switch (nNewCameraMode)
	{
	case FIRST_PERSON_CAMERA:
		pNewCamera = new CFirstPersonCamera(m_pCamera);
		break;
	case THIRD_PERSON_CAMERA:
		pNewCamera = new CThirdPersonCamera(m_pCamera);
		break;
	case SPACESHIP_CAMERA:
		pNewCamera = new CSpaceShipCamera(m_pCamera);
		break;
	}
	if (nCurrentCameraMode == SPACESHIP_CAMERA)
	{
		m_xmf3Right = Vector3::Normalize(XMFLOAT3(m_xmf3Right.x, 0.0f, m_xmf3Right.z));
		m_xmf3Up = Vector3::Normalize(XMFLOAT3(0.0f, 1.0f, 0.0f));
		m_xmf3Look = Vector3::Normalize(XMFLOAT3(m_xmf3Look.x, 0.0f, m_xmf3Look.z));

		m_fPitch = 0.0f;
		m_fRoll = 0.0f;
		m_fYaw = Vector3::Angle(XMFLOAT3(0.0f, 0.0f, 1.0f), m_xmf3Look);
		if (m_xmf3Look.x < 0.0f) m_fYaw = -m_fYaw;
	}
	else if ((nNewCameraMode == SPACESHIP_CAMERA) && m_pCamera)
	{
		m_xmf3Right = m_pCamera->GetRightVector();
		m_xmf3Up = m_pCamera->GetUpVector();
		m_xmf3Look = m_pCamera->GetLookVector();
	}

	if (pNewCamera)
	{
		pNewCamera->SetMode(nNewCameraMode);
		pNewCamera->SetPlayer(this);
	}

	if (m_pCamera) delete m_pCamera;

	return(pNewCamera);
}

void CPlayer::OnPrepareRender()
{
	m_xmf4x4ToParent._11 = m_xmf3Right.x; m_xmf4x4ToParent._12 = m_xmf3Right.y; m_xmf4x4ToParent._13 = m_xmf3Right.z;
	m_xmf4x4ToParent._21 = m_xmf3Up.x; m_xmf4x4ToParent._22 = m_xmf3Up.y; m_xmf4x4ToParent._23 = m_xmf3Up.z;
	m_xmf4x4ToParent._31 = m_xmf3Look.x; m_xmf4x4ToParent._32 = m_xmf3Look.y; m_xmf4x4ToParent._33 = m_xmf3Look.z;
	m_xmf4x4ToParent._41 = m_xmf3Position.x; m_xmf4x4ToParent._42 = m_xmf3Position.y; m_xmf4x4ToParent._43 = m_xmf3Position.z;

	m_xmf4x4ToParent = Matrix4x4::Multiply(XMMatrixScaling(m_xmf3Scale.x, m_xmf3Scale.y, m_xmf3Scale.z), m_xmf4x4ToParent);

	UpdateTransform(NULL);
}

void CPlayer::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	DWORD nCameraMode = (pCamera) ? pCamera->GetMode() : 0x00;
	if (nCameraMode == THIRD_PERSON_CAMERA) CGameObject::Render(pd3dCommandList, pCamera);
	if (nCameraMode == SPACESHIP_CAMERA) CGameObject::Render(pd3dCommandList, pCamera);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 
CAirplanePlayer::CAirplanePlayer(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, void* pContext)
{
	m_pCamera = ChangeCamera(SPACESHIP_CAMERA, 0.0f);
	SphereCollider = new CSphereCollider(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	SphereCollider->SetScale(10, 10, 10);
	SphereCollider->SetSphereCollider(GetPosition() , 10.0f);

	m_pMissleModel = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature, "Model/Missle.bin", NULL, MODEL_ACE);
	m_pMissleModelCol = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature, "Model/Sphere.bin", NULL, MODEL_COL);

	CLoadedModelInfo* pModel = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature, "Model/F-4E_Phantom_II.bin", NULL, MODEL_ACE);
	SetChild(pModel->m_pModelRootObject);

	m_fRollPerformance = 100.0f;
	m_fPitchPerformance = 70.0f;
	m_fYawPerformance = 20.0f;

	m_pd3dDevice = pd3dDevice;
	m_pd3dCommandList = pd3dCommandList;
	m_pd3dGraphicsRootSignature = pd3dGraphicsRootSignature;

	//MissleLaunch(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature,m_xmf3Position);

	OnPrepareAnimate();

	CreateShaderVariables(pd3dDevice, pd3dCommandList);
	if (pModel) delete pModel;
}

CAirplanePlayer::~CAirplanePlayer()
{
}

void CAirplanePlayer::OnPrepareAnimate()
{
	m_pLeft_Deact_Wing = FindFrame("Left_Deact_Wing");
	m_pRight_Deact_Wing = FindFrame("Right_Deact_Wing");
	m_pLeft_Pitch_Wing = FindFrame("Left_Pitch_Wing");
	m_pRight_Pitch_Wing = FindFrame("Right_Pitch_Wing");
	m_pLeft_Roll_Wing = FindFrame("Left_Roll_Wing");
	m_pRight_Roll_Wing = FindFrame("Right_Roll_Wing");
	m_pYaw_Wing = FindFrame("Yaw_Wing");

	m_pMSL_1 = FindFrame("MSL_1");
	m_pMSL_2 = FindFrame("MSL_2");
	m_pMSL_3 = FindFrame("MSL_3");
	m_pMSL_4 = FindFrame("MSL_4");
	m_pSP_1 = FindFrame("SP_1");
	m_pSP_2 = FindFrame("SP_2");

	m_pLeft_AfterBurner[0] = FindFrame("Left_AfterBuner");
	m_pLeft_AfterBurner[1] = FindFrame("Left_AfterBuner_1");
	m_pLeft_AfterBurner[2] = FindFrame("Left_AfterBuner_2");
	m_pLeft_AfterBurner[3] = FindFrame("Left_AfterBuner_3");
	m_pLeft_AfterBurner[4] = FindFrame("Left_AfterBuner_4");
	m_pLeft_AfterBurner[5] = FindFrame("Left_AfterBuner_5");
	m_pLeft_AfterBurner[6] = FindFrame("Left_AfterBuner_6");
	m_pLeft_AfterBurner[7] = FindFrame("Left_AfterBuner_7");
	m_pLeft_AfterBurner[8] = FindFrame("Left_AfterBuner_8");
	m_pLeft_AfterBurner[9] = FindFrame("Left_AfterBuner_9");

	m_pRight_AfterBurner[0] = FindFrame("Right_AfterBuner");
	m_pRight_AfterBurner[1] = FindFrame("Right_AfterBuner_1");
	m_pRight_AfterBurner[2] = FindFrame("Right_AfterBuner_2");
	m_pRight_AfterBurner[3] = FindFrame("Right_AfterBuner_3");
	m_pRight_AfterBurner[4] = FindFrame("Right_AfterBuner_4");
	m_pRight_AfterBurner[5] = FindFrame("Right_AfterBuner_5");
	m_pRight_AfterBurner[6] = FindFrame("Right_AfterBuner_6");
	m_pRight_AfterBurner[7] = FindFrame("Right_AfterBuner_7");
	m_pRight_AfterBurner[8] = FindFrame("Right_AfterBuner_8");
	m_pRight_AfterBurner[9] = FindFrame("Right_AfterBuner_9");

	for (int i = 0; i < 10; ++i)
	{
		CAfterBurner* pBurner;
		pBurner = new CAfterBurner();
		pBurner->SetMesh((CMesh*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"AfterBurner", OBJ_EFFECT)->m_pPlaneMesh);
		pBurner->m_pCamera = m_pCamera;
		for (int i = 0; i < 10; ++i)
			pBurner->m_pEffectTexture[i] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"AfterBurner", OBJ_EFFECT)->m_pEffectTexture[i];
		pBurner->m_pEffectMaterial = new CMaterial(1);
		pBurner->m_pEffectMaterial->SetTexture(pBurner->m_pEffectTexture[i]);
		pBurner->m_pEffectMaterial->SetShader(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"AfterBurner", OBJ_EFFECT)->m_EffectShader);
		pBurner->SetMaterial(0, pBurner->m_pEffectMaterial);
		m_pLeft_AfterBurner[i]->m_pAfterBurner = pBurner;
		GET_MANAGER<ObjectManager>()->AddObject(L"AfterBurnerInstance", m_pLeft_AfterBurner[i]->m_pAfterBurner, OBJ_EFFECT);
	}

	for (int i = 0; i < 10; ++i)
	{
		CAfterBurner* pBurner;
		pBurner = new CAfterBurner();
		pBurner->SetMesh((CMesh*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"AfterBurner", OBJ_EFFECT)->m_pPlaneMesh);
		pBurner->m_pCamera = m_pCamera;
		for (int i = 0; i < 10; ++i)
			pBurner->m_pEffectTexture[i] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"AfterBurner", OBJ_EFFECT)->m_pEffectTexture[i];
		pBurner->m_pEffectMaterial = new CMaterial(1);
		pBurner->m_pEffectMaterial->SetTexture(pBurner->m_pEffectTexture[i]);
		pBurner->m_pEffectMaterial->SetShader(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"AfterBurner", OBJ_EFFECT)->m_EffectShader);
		pBurner->SetMaterial(0, pBurner->m_pEffectMaterial);
		m_pRight_AfterBurner[i]->m_pAfterBurner = pBurner;
		GET_MANAGER<ObjectManager>()->AddObject(L"AfterBurnerInstance", m_pRight_AfterBurner[i]->m_pAfterBurner, OBJ_EFFECT);
	}

	//m_xmMSL_1 = m_pMSL_1->m_xmf4x4World;
}

void CPlayer::WingAnimate(float fTimeElapsed, DWORD Direction)
{
	CGameObject::Animate(fTimeElapsed);
	if (SphereCollider)SphereCollider->SetPosition(m_xmf3Position);
	if (SphereCollider)SphereCollider->m_xmf4x4ToParent = Matrix4x4::Multiply(XMMatrixScaling(5, 5, 5), m_xmf4x4ToParent);
	if (SphereCollider)SphereCollider->Animate(fTimeElapsed, GetPosition());
}

void CAirplanePlayer::LeftRollAnimation(float fTimeElapsed)
{
	if (Roll_WingsRotateDegree > 0)
	{
		RollWingReturn(fTimeElapsed);
		CGameObject::Animate(fTimeElapsed);
		return;
	}
	if (Roll_WingsRotateDegree > -1.0f)
	{
		XMMATRIX xmmtxRotate = XMMatrixRotationX(XMConvertToRadians(Roll_WingsRotateDegree * 50.0f) * fTimeElapsed);
		m_pLeft_Roll_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate, m_pLeft_Roll_Wing->m_xmf4x4ToParent);

		XMMATRIX xmmtxRotate1 = XMMatrixRotationX(XMConvertToRadians(-Roll_WingsRotateDegree * 50.0f) * fTimeElapsed);
		m_pRight_Roll_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate1, m_pRight_Roll_Wing->m_xmf4x4ToParent);

		Roll_WingsRotateDegree -= fTimeElapsed;
		CGameObject::Animate(fTimeElapsed);
	}
}

void CAirplanePlayer::RightRollAnimation(float fTimeElapsed)
{
	if (Roll_WingsRotateDegree < 0)
	{
		RollWingReturn(fTimeElapsed);
		CGameObject::Animate(fTimeElapsed);
		return;
	}
	if (Roll_WingsRotateDegree < 1.0f)
	{
		XMMATRIX xmmtxRotate = XMMatrixRotationX(XMConvertToRadians(-Roll_WingsRotateDegree * 50.0f) * fTimeElapsed);
		m_pRight_Roll_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate, m_pRight_Roll_Wing->m_xmf4x4ToParent);

		XMMATRIX xmmtxRotate1 = XMMatrixRotationX(XMConvertToRadians(Roll_WingsRotateDegree * 50.0f) * fTimeElapsed);
		m_pLeft_Roll_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate1, m_pLeft_Roll_Wing->m_xmf4x4ToParent);

		Roll_WingsRotateDegree += fTimeElapsed;
		CGameObject::Animate(fTimeElapsed);
	}
}

void CAirplanePlayer::UpPitchAnimation(float fTimeElapsed)
{
	//MissleLaunch();
	if (Pitch_WingsRotateDegree > 0)
	{
		PitchWingReturn(fTimeElapsed);
		CGameObject::Animate(fTimeElapsed);
		return;
	}
	if (Pitch_WingsRotateDegree > -1.0f)
	{
		XMMATRIX xmmtxRotate = XMMatrixRotationX(XMConvertToRadians(Pitch_WingsRotateDegree * 50.0f) * fTimeElapsed);
		m_pLeft_Pitch_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate, m_pLeft_Pitch_Wing->m_xmf4x4ToParent);

		XMMATRIX xmmtxRotate1 = XMMatrixRotationX(XMConvertToRadians(Pitch_WingsRotateDegree * 50.0f) * fTimeElapsed);
		m_pRight_Pitch_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate1, m_pRight_Pitch_Wing->m_xmf4x4ToParent);

		Pitch_WingsRotateDegree -= fTimeElapsed;
		CGameObject::Animate(fTimeElapsed);
	}
}

void CAirplanePlayer::DownPitchAnimation(float fTimeElapsed)
{
	if (Pitch_WingsRotateDegree < 0)
	{
		PitchWingReturn(fTimeElapsed);
		CGameObject::Animate(fTimeElapsed);
		return;
	}
	if (Pitch_WingsRotateDegree < 1.0f)
	{
		XMMATRIX xmmtxRotate = XMMatrixRotationX(XMConvertToRadians(Pitch_WingsRotateDegree * 50.0f) * fTimeElapsed);
		m_pLeft_Pitch_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate, m_pLeft_Pitch_Wing->m_xmf4x4ToParent);

		XMMATRIX xmmtxRotate1 = XMMatrixRotationX(XMConvertToRadians(Pitch_WingsRotateDegree * 50.0f) * fTimeElapsed);
		m_pRight_Pitch_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate1, m_pRight_Pitch_Wing->m_xmf4x4ToParent);

		Pitch_WingsRotateDegree += fTimeElapsed;
		CGameObject::Animate(fTimeElapsed);

	}
}

void CAirplanePlayer::LeftYawAnimation(float fTimeElapsed)
{
	if (Yaw_WingsRotateDegree > 0)
	{
		YawWingReturn(fTimeElapsed);
		CGameObject::Animate(fTimeElapsed);
		return;
	}
	if (Yaw_WingsRotateDegree > -0.7f)
	{
		XMMATRIX xmmtxRotate = XMMatrixRotationZ(XMConvertToRadians(-Yaw_WingsRotateDegree * 50.0f) * fTimeElapsed);
		m_pYaw_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate, m_pYaw_Wing->m_xmf4x4ToParent);

		Yaw_WingsRotateDegree -= fTimeElapsed;
		CGameObject::Animate(fTimeElapsed);
	}
}

void CAirplanePlayer::RightYawAnimation(float fTimeElapsed)
{
	if (Yaw_WingsRotateDegree < 0)
	{
		YawWingReturn(fTimeElapsed);
		CGameObject::Animate(fTimeElapsed);
		return;
	}
	if (Yaw_WingsRotateDegree < 0.7f)
	{
		XMMATRIX xmmtxRotate = XMMatrixRotationZ(XMConvertToRadians(-Yaw_WingsRotateDegree * 50.0f) * fTimeElapsed);
		m_pYaw_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate, m_pYaw_Wing->m_xmf4x4ToParent);

		Yaw_WingsRotateDegree += fTimeElapsed;
		CGameObject::Animate(fTimeElapsed);
	}
}

void CAirplanePlayer::RollWingReturn(float fTimeElapsed)
{
	if (Roll_WingsRotateDegree < 0)
	{
		XMMATRIX xmmtxRotate = XMMatrixRotationX(XMConvertToRadians(-Roll_WingsRotateDegree * 50.0f) * fTimeElapsed);
		if (m_pLeft_Roll_Wing)m_pLeft_Roll_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate, m_pLeft_Roll_Wing->m_xmf4x4ToParent);

		XMMATRIX xmmtxRotate1 = XMMatrixRotationX(XMConvertToRadians(Roll_WingsRotateDegree * 50.0f) * fTimeElapsed);
		if (m_pRight_Roll_Wing)m_pRight_Roll_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate1, m_pRight_Roll_Wing->m_xmf4x4ToParent);

		Roll_WingsRotateDegree += fTimeElapsed;
		if (Roll_WingsRotateDegree >= 0)
		{
			Roll_WingsRotateDegree = 0;
			m_pLeft_Roll_Wing->m_xmf4x4ToParent._22 = 0;
			m_pRight_Roll_Wing->m_xmf4x4ToParent._22 = 0;
		}
	}
	if (Roll_WingsRotateDegree > 0)
	{
		XMMATRIX xmmtxRotate = XMMatrixRotationX(XMConvertToRadians(-Roll_WingsRotateDegree * 50.0f) * fTimeElapsed);
		if (m_pLeft_Roll_Wing)m_pLeft_Roll_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate, m_pLeft_Roll_Wing->m_xmf4x4ToParent);

		XMMATRIX xmmtxRotate1 = XMMatrixRotationX(XMConvertToRadians(Roll_WingsRotateDegree * 50.0f) * fTimeElapsed);
		if (m_pRight_Roll_Wing)m_pRight_Roll_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate1, m_pRight_Roll_Wing->m_xmf4x4ToParent);

		Roll_WingsRotateDegree -= fTimeElapsed;
		if (Roll_WingsRotateDegree <= 0)
		{
			Roll_WingsRotateDegree = 0;
			m_pLeft_Roll_Wing->m_xmf4x4ToParent._22 = 0;
			m_pRight_Roll_Wing->m_xmf4x4ToParent._22 = 0;
		}
	}
}
void CAirplanePlayer::PitchWingReturn(float fTimeElapsed)
{
	//pitch
	if (Pitch_WingsRotateDegree < 0)
	{
		XMMATRIX xmmtxRotate = XMMatrixRotationX(XMConvertToRadians(-Pitch_WingsRotateDegree * 50.0f) * fTimeElapsed);
		if (m_pLeft_Pitch_Wing)m_pLeft_Pitch_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate, m_pLeft_Pitch_Wing->m_xmf4x4ToParent);

		XMMATRIX xmmtxRotate1 = XMMatrixRotationX(XMConvertToRadians(-Pitch_WingsRotateDegree * 50.0f) * fTimeElapsed);
		if (m_pRight_Pitch_Wing)m_pRight_Pitch_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate1, m_pRight_Pitch_Wing->m_xmf4x4ToParent);

		Pitch_WingsRotateDegree += fTimeElapsed;
		if (Pitch_WingsRotateDegree > 0)
		{
			Pitch_WingsRotateDegree = 0;
			m_pRight_Pitch_Wing->m_xmf4x4ToParent._22 = 0;
			m_pLeft_Pitch_Wing->m_xmf4x4ToParent._22 = 0;
		}
	}
	if (Pitch_WingsRotateDegree > 0)
	{
		XMMATRIX xmmtxRotate = XMMatrixRotationX(XMConvertToRadians(-Pitch_WingsRotateDegree * 50.0f) * fTimeElapsed);
		if (m_pLeft_Pitch_Wing)m_pLeft_Pitch_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate, m_pLeft_Pitch_Wing->m_xmf4x4ToParent);

		XMMATRIX xmmtxRotate1 = XMMatrixRotationX(XMConvertToRadians(-Pitch_WingsRotateDegree * 50.0f) * fTimeElapsed);
		if (m_pRight_Pitch_Wing)m_pRight_Pitch_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate1, m_pRight_Pitch_Wing->m_xmf4x4ToParent);

		Pitch_WingsRotateDegree -= fTimeElapsed;
		if (Pitch_WingsRotateDegree < 0)
		{
			Pitch_WingsRotateDegree = 0;
			m_pRight_Pitch_Wing->m_xmf4x4ToParent._22 = 0;
			m_pLeft_Pitch_Wing->m_xmf4x4ToParent._22 = 0;
		}
	}
}

void CAirplanePlayer::YawWingReturn(float fTimeElapsed)
{
	if (Yaw_WingsRotateDegree < 0)
	{
		XMMATRIX xmmtxRotate = XMMatrixRotationZ(XMConvertToRadians(Yaw_WingsRotateDegree * 50.0f) * fTimeElapsed);
		if (m_pYaw_Wing)m_pYaw_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate, m_pYaw_Wing->m_xmf4x4ToParent);

		Yaw_WingsRotateDegree += fTimeElapsed;
		if (Yaw_WingsRotateDegree > 0)
		{
			Yaw_WingsRotateDegree = 0;
			m_pYaw_Wing->m_xmf4x4ToParent._21 = 0;
		}
	}
	if (Yaw_WingsRotateDegree > 0)
	{
		XMMATRIX xmmtxRotate = XMMatrixRotationZ(XMConvertToRadians(Yaw_WingsRotateDegree * 50.0f) * fTimeElapsed);
		if (m_pYaw_Wing)m_pYaw_Wing->m_xmf4x4ToParent = Matrix4x4::Multiply(xmmtxRotate, m_pYaw_Wing->m_xmf4x4ToParent);

		Yaw_WingsRotateDegree -= fTimeElapsed;
		if (Yaw_WingsRotateDegree < 0)
		{
			Yaw_WingsRotateDegree = 0;
			m_pYaw_Wing->m_xmf4x4ToParent._21 = 0;
		}
	}
}

void CAirplanePlayer::MissleLaunch()
{
	CMissle* pMissle;

	for (auto& Ene : m_ObjManager->GetObjFromType(OBJ_ENEMY))
	{
		if (Ene.second->bLockOnFire == true&&Ene.second->GetState() != true)
		{
			XMFLOAT3* temp = Ene.second->GetPositionForMissle();

			pMissle = new CMissle(m_pd3dDevice, m_pd3dCommandList, m_pd3dGraphicsRootSignature, m_pMissleModelCol, temp, m_xmf3Position, m_ObjManager);
			pMissle->m_pCamera = m_pCamera;
			pMissle->m_xmf3Look = m_xmf3Look;
			pMissle->m_xmf4x4ToParent = Matrix4x4::Multiply(XMMatrixScaling(1, 1, 1), m_xmf4x4ToParent);
			pMissle->SetChild(m_pMissleModel->m_pModelRootObject);
			pMissle->SetScale(1, 1, 1);
			pMissle->SetPosition(m_pMSL_1->GetPosition());
			m_ObjManager->AddObject(L"player_missle", pMissle, OBJ_MISSLE);
		}
	}


	
	//cout << pMissle->SphereCollider->GetPosition().z << endl;
	//cout << m_ObjManager->GetObjFromTag(L"player_missle", OBJ_MISSLE)->SphereCollider->GetPosition().z << endl;
	//m_ObjManager->GetObjFromTag(L"player_missle", OBJ_MISSLE)->m_xmf4x4World = m_xmMSL_1;
	//m_ObjManager->GetObjFromTag(L"player_missle", OBJ_MISSLE)->SetScale(10,10,10);
}

void CAirplanePlayer::SetAfterBurnerPosition(float fTimeElapsed)
{
	for (int i = 0; i < 10; ++i)
	{
		if (m_pLeft_AfterBurner[i])
		{
			if (m_fBurnerElapsed / 100 < 1)
			{
				m_pLeft_AfterBurner[i]->m_pAfterBurner->SetScale(m_fBurnerElapsed / 100, m_fBurnerElapsed / 100, 0);
				m_pRight_AfterBurner[i]->m_pAfterBurner->SetScale(m_fBurnerElapsed / 100, m_fBurnerElapsed / 100, 0);
			}
			m_pLeft_AfterBurner[i]->m_pAfterBurner->SetPosition(m_pLeft_AfterBurner[i]->GetPosition());
			m_pRight_AfterBurner[i]->m_pAfterBurner->SetPosition(m_pRight_AfterBurner[i]->GetPosition());
		}
	}
}

void CAirplanePlayer::OnPrepareRender()
{
	CPlayer::OnPrepareRender();
}

CCamera* CAirplanePlayer::ChangeCamera(DWORD nNewCameraMode, float fTimeElapsed)
{
	DWORD nCurrentCameraMode = (m_pCamera) ? m_pCamera->GetMode() : 0x00;
	if (nCurrentCameraMode == nNewCameraMode) return(m_pCamera);
	switch (nNewCameraMode)
	{
	case FIRST_PERSON_CAMERA:
		SetFriction(2.0f);
		SetGravity(XMFLOAT3(0.0f, 0.0f, 0.0f));
		SetMaxVelocityXZ(2.5f);
		SetMaxVelocityY(40.0f);
		m_pCamera = OnChangeCamera(FIRST_PERSON_CAMERA, nCurrentCameraMode);
		m_pCamera->SetTimeLag(0.0f);
		m_pCamera->SetOffset(XMFLOAT3(0.0f, 20.0f, 0.0f));
		m_pCamera->GenerateProjectionMatrix(1.01f, 5000.0f, ASPECT_RATIO, 60.0f);
		m_pCamera->OrthogonalProjectionMatrix(1.01f, 5000.0f, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT);
		m_pCamera->SetViewport(0, 0, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT, 0.0f, 1.0f);
		m_pCamera->SetScissorRect(0, 0, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT);
		break;
	case SPACESHIP_CAMERA:
		SetFriction(1200);
		SetGravity(XMFLOAT3(0.0f, 0.0f, 0.0f));
		SetMaxVelocityXZ(1000.0f);
		SetMaxVelocityY(1000.0f);
		m_pCamera = OnChangeCamera(SPACESHIP_CAMERA, nCurrentCameraMode);
		m_pCamera->SetTimeLag(0.0f);
		m_pCamera->SetOffset(XMFLOAT3(0.0f, 1.0f, -5.0f));
		m_pCamera->GenerateProjectionMatrix(1.01f, m_fFarPlaneDistance, ASPECT_RATIO, 60.0f);
		m_pCamera->OrthogonalProjectionMatrix(1.01f, 5000.0f, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT);
		m_pCamera->SetViewport(0, 0, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT, 0.0f, 1.0f);
		m_pCamera->SetScissorRect(0, 0, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT);
		break;
	case THIRD_PERSON_CAMERA:
		SetFriction(20.5f);
		SetGravity(XMFLOAT3(0.0f, 0.0f, 0.0f));
		SetMaxVelocityXZ(25.5f);
		SetMaxVelocityY(20.0f);
		m_pCamera = OnChangeCamera(THIRD_PERSON_CAMERA, nCurrentCameraMode);
		m_pCamera->SetTimeLag(0.0f);
		m_pCamera->SetOffset(XMFLOAT3(0.0f, 1.0f, -5.0f));
		m_pCamera->GenerateProjectionMatrix(1.01f, 5000.0f, ASPECT_RATIO, 60.0f);
		m_pCamera->OrthogonalProjectionMatrix(1.01f, 5000.0f, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT);
		m_pCamera->SetViewport(0, 0, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT, 0.0f, 1.0f);
		m_pCamera->SetScissorRect(0, 0, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT);
		break;
	default:
		break;
	}

	m_pCamera->SetPosition(Vector3::Add(m_xmf3Position, m_pCamera->GetOffset()));
	Animate(fTimeElapsed);

	return(m_pCamera);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 
CTerrainPlayer::CTerrainPlayer(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, void* pContext)
{
	m_pCamera = ChangeCamera(THIRD_PERSON_CAMERA, 0.0f);

	CLoadedModelInfo* pAngrybotModel = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature, "Model/Angrybot.bin", NULL, MODEL_ANI);
	SetChild(pAngrybotModel->m_pModelRootObject, true);
	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	SetPlayerUpdatedContext(pContext);
	SetCameraUpdatedContext(pContext);
}

CTerrainPlayer::~CTerrainPlayer()
{
}

CCamera* CTerrainPlayer::ChangeCamera(DWORD nNewCameraMode, float fTimeElapsed)
{
	DWORD nCurrentCameraMode = (m_pCamera) ? m_pCamera->GetMode() : 0x00;
	if (nCurrentCameraMode == nNewCameraMode) return(m_pCamera);
	switch (nNewCameraMode)
	{
	case FIRST_PERSON_CAMERA:
		SetFriction(250.0f);
		SetGravity(XMFLOAT3(0.0f, -400.0f, 0.0f));
		SetMaxVelocityXZ(300.0f);
		SetMaxVelocityY(400.0f);
		m_pCamera = OnChangeCamera(FIRST_PERSON_CAMERA, nCurrentCameraMode);
		m_pCamera->SetTimeLag(0.0f);
		m_pCamera->SetOffset(XMFLOAT3(0.0f, 20.0f, 0.0f));
		m_pCamera->GenerateProjectionMatrix(1.01f, 5000.0f, ASPECT_RATIO, 60.0f);
		m_pCamera->SetViewport(0, 0, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT, 0.0f, 1.0f);
		m_pCamera->SetScissorRect(0, 0, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT);
		break;
	case SPACESHIP_CAMERA:
		SetFriction(125.0f);
		SetGravity(XMFLOAT3(0.0f, 0.0f, 0.0f));
		SetMaxVelocityXZ(300.0f);
		SetMaxVelocityY(400.0f);
		m_pCamera = OnChangeCamera(SPACESHIP_CAMERA, nCurrentCameraMode);
		m_pCamera->SetTimeLag(0.0f);
		m_pCamera->SetOffset(XMFLOAT3(0.0f, 0.0f, 0.0f));
		m_pCamera->GenerateProjectionMatrix(1.01f, 10000.0f, ASPECT_RATIO, 60.0f);
		m_pCamera->SetViewport(0, 0, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT, 0.0f, 1.0f);
		m_pCamera->SetScissorRect(0, 0, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT);
		break;
	case THIRD_PERSON_CAMERA:
		SetFriction(250.0f);
		SetGravity(XMFLOAT3(0.0f, -250.0f, 0.0f));
		SetMaxVelocityXZ(300.0f);
		SetMaxVelocityY(400.0f);
		m_pCamera = OnChangeCamera(THIRD_PERSON_CAMERA, nCurrentCameraMode);
		m_pCamera->SetTimeLag(0.25f);
		m_pCamera->SetOffset(XMFLOAT3(0.0f, 20.0f, -50.0f));
		m_pCamera->GenerateProjectionMatrix(1.01f, 5000.0f, ASPECT_RATIO, 60.0f);
		m_pCamera->SetViewport(0, 0, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT, 0.0f, 1.0f);
		m_pCamera->SetScissorRect(0, 0, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT);
		break;
	default:
		break;
	}

	m_pCamera->SetPosition(Vector3::Add(m_xmf3Position, m_pCamera->GetOffset()));
	Update(fTimeElapsed);

	return(m_pCamera);
}

void CTerrainPlayer::OnPlayerUpdateCallback(float fTimeElapsed)
{
	CHeightMapTerrain* pTerrain = (CHeightMapTerrain*)m_pPlayerUpdatedContext;
	XMFLOAT3 xmf3Scale = pTerrain->GetScale();
	XMFLOAT3 xmf3PlayerPosition = GetPosition();
	int z = (int)(xmf3PlayerPosition.z / xmf3Scale.z);
	bool bReverseQuad = ((z % 2) != 0);
	float fHeight = pTerrain->GetHeight(xmf3PlayerPosition.x, xmf3PlayerPosition.z, bReverseQuad) + 0.0f;
	if (xmf3PlayerPosition.y < fHeight)
	{
		XMFLOAT3 xmf3PlayerVelocity = GetVelocity();
		xmf3PlayerVelocity.y = 0.0f;
		SetVelocity(xmf3PlayerVelocity);
		xmf3PlayerPosition.y = fHeight;
		SetPosition(xmf3PlayerPosition);
	}
}

void CTerrainPlayer::OnCameraUpdateCallback(float fTimeElapsed)
{
	CHeightMapTerrain* pTerrain = (CHeightMapTerrain*)m_pCameraUpdatedContext;
	XMFLOAT3 xmf3Scale = pTerrain->GetScale();
	XMFLOAT3 xmf3CameraPosition = m_pCamera->GetPosition();
	int z = (int)(xmf3CameraPosition.z / xmf3Scale.z);
	bool bReverseQuad = ((z % 2) != 0);
	float fHeight = pTerrain->GetHeight(xmf3CameraPosition.x, xmf3CameraPosition.z, bReverseQuad) + 5.0f;
	if (xmf3CameraPosition.y <= fHeight)
	{
		xmf3CameraPosition.y = fHeight;
		m_pCamera->SetPosition(xmf3CameraPosition);
		if (m_pCamera->GetMode() == THIRD_PERSON_CAMERA)
		{
			CThirdPersonCamera* p3rdPersonCamera = (CThirdPersonCamera*)m_pCamera;
			p3rdPersonCamera->SetLookAt(GetPosition());
		}
	}
}

int CTerrainPlayer::Update(float fTimeElapsed)
{
	CPlayer::Animate(fTimeElapsed);

	float fLength = sqrtf(m_xmf3Velocity.x * m_xmf3Velocity.x + m_xmf3Velocity.z * m_xmf3Velocity.z);
	SetTrackAnimationSet(0, ::IsZero(fLength) ? 0 : 1);

	return 0;
}