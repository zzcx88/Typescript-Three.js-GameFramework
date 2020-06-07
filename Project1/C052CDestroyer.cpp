#include "stdafx.h"
#include "C052CDestroyer.h"
#include "CUI.h"
#include "CLockOnUI.h"
#include "CMissleFog.h"

C052CDestroyer::C052CDestroyer()
{
	m_bReffernce = false;
	m_ObjManager = GET_MANAGER<ObjectManager>();
	m_pModelInfo = m_ObjManager->GetObjFromTag(L"052CRef", OBJ_ENEMY)->m_pModelInfo;

	SphereCollider = new CSphereCollider();
	SphereCollider->SetSphereCollider(GetPosition(), 250);
	SphereCollider->SetScale(250, 250, 250);

	OnPrepareAnimate();
	SetChild(m_pModelInfo->m_pModelRootObject);
	SetScale(10, 10, 10);

	m_fHP = 200;
}

C052CDestroyer::C052CDestroyer(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature)
{
	m_bReffernce = true;
	m_ObjManager = GET_MANAGER<ObjectManager>();
	m_pModelInfo = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature, "Model/052C_root.bin", NULL, MODEL_STD);
	SphereCollider = new CSphereCollider(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	SphereCollider->SetScale(20, 20, 20);
	SphereCollider->SetSphereCollider(GetPosition(), 250);

	m_xmf3Look = GetLook();
	m_xmf3Right = GetRight();
	m_xmf3Up = GetUp();

	SetChild(m_pModelInfo->m_pModelRootObject);

	OnPrepareAnimate();

	CreateShaderVariables(pd3dDevice, pd3dCommandList);
}

C052CDestroyer::~C052CDestroyer()
{
}

void C052CDestroyer::OnPrepareAnimate()
{
}

void C052CDestroyer::Animate(float fTimeElapsed)
{
	m_fAddFogTimeElapsed += fTimeElapsed;
	m_xmf3Position.x = m_xmf4x4ToParent._41;
	m_xmf3Position.y = m_xmf4x4ToParent._42;
	m_xmf3Position.z = m_xmf4x4ToParent._43;
	
	CGameObject::Animate(fTimeElapsed);
	if (SphereCollider)SphereCollider->SetPosition(GetPosition());
	if (SphereCollider)SphereCollider->m_xmf4x4ToParent = Matrix4x4::Multiply(XMMatrixScaling(250, 250, 250), m_xmf4x4ToParent);
	if (SphereCollider)SphereCollider->Animate(fTimeElapsed, GetPosition());

	GET_MANAGER<CollisionManager>()->CollisionSphere(this, &GET_MANAGER<ObjectManager>()->GetObjFromType(OBJ_ENEMY));
	
	if (m_bReffernce == false && m_bDestroyed == false)
	{
		//GET_MANAGER<AIManager>()->DoAction(AI_SHIP, this);
	}

	if (m_bDestroyed == true)
	{
		XMFLOAT3 xmf3Axise = XMFLOAT3(0.f, 0.f, -1.f);
		RotateFallow(&xmf3Axise, 50 * fTimeElapsed);
		Move(DIR_LEFT, 50 * fTimeElapsed, false);
	}
}

void C052CDestroyer::CollisionActivate(CGameObject* collideTarget)
{
	if (m_bReffernce == false && m_bDestroyed == false)
	{
		if (collideTarget->m_ObjType == OBJ_ALLYMISSLE)
		{
			wcout << GET_MANAGER<ObjectManager>()->GetTagFromObj(this, OBJ_ENEMY) << endl;
			cout << "충돌!" << endl;

			m_fHP -= 40;
		}
		if (collideTarget->m_ObjType == OBJ_ALLYBULLET)
		{
			wcout << GET_MANAGER<ObjectManager>()->GetTagFromObj(this, OBJ_ENEMY) << endl;
			cout << "충돌!" << endl;

			m_fHP -= 5;
			//GET_MANAGER<SceneManager>()->m_nTgtObject--;
		}
		if (m_fHP <= 0)
		{
			m_bDestroyed = true;
			m_pUI->m_bDestroyed = true;
			m_pLockOnUI->m_bDestroyed = true;
		}
	}
}

void C052CDestroyer::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	//if (SphereCollider)SphereCollider->Render(pd3dCommandList, pCamera);
	
	if (m_bDestroyed == true)
	{
		m_fDeadElapsed += 1.f * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed();
		if (m_fDeadElapsed >= m_fDeadFrequence)
		{
			m_isDead = true;
			m_pUI->m_isDead = true;
			m_pLockOnUI->m_isDead = true;

			if (GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bEye_fixation == true)
			{
				CPlayer* pPlayer = (CPlayer*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER);
				if (pPlayer->GetFixTarget().x == GetPosition().x && pPlayer->GetFixTarget().y == GetPosition().y && pPlayer->GetFixTarget().z == GetPosition().z)
				{
					pPlayer->m_bEye_fixation = false;
					pPlayer->ReturnEyeFix();
				}
			}
		}
	}

	CGameObject::Render(pd3dCommandList, pCamera);
}
