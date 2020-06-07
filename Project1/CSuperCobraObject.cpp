#include "stdafx.h"
#include "CSuperCobraObject.h"
#include "CUI.h"
#include "CLockOnUI.h"

CSuperCobraObject::CSuperCobraObject()
{
	m_ObjManager = GET_MANAGER<ObjectManager>();
	m_pModelInfo = m_ObjManager->GetObjFromTag(L"mig21Ref", OBJ_ENEMY)->m_pModelInfo;

	SphereCollider = new CSphereCollider();
	SphereCollider->SetSphereCollider(GetPosition(), 5.f);

	SetChild(m_pModelInfo->m_pModelRootObject);
	SetScale(10.f, 10.f, 10.f);
}

CSuperCobraObject::CSuperCobraObject(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature)
{
	m_bReffernce = true;
	m_pModelInfo = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature, "Model/F-4E_Phantom_II.bin", NULL, MODEL_ACE);
	SphereCollider = new CSphereCollider(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	SphereCollider->SetScale(10, 10, 10);
	SphereCollider->SetSphereCollider(GetPosition(), 10.0f);

	m_xmf3Look = GetLook();
	m_xmf3Right = GetRight();
	m_xmf3Up = GetUp();

	SetChild(m_pModelInfo->m_pModelRootObject);

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

	GET_MANAGER<CollisionManager>()->CollisionSphere(this, &GET_MANAGER<ObjectManager>()->GetObjFromType(OBJ_ENEMY));
	if (m_bAllyCollide == true)
	{
		m_fMoveFowardElapsed += fTimeElapsed;
		RotateFallow(&m_xmf3Ai_ColideAxis, 50.f * fTimeElapsed);
		if (m_fMoveFowardElapsed >= m_fElapsedFrequency)
		{
			m_bAllyCollide = false;
			m_fMoveFowardElapsed = 0.f;
			m_xmf3Ai_EvadeAxis = XMFLOAT3(0, 0, 0);
		}
	}
	/*else
	{
		Rotate(60 * fTimeElapsed,0,0);
		MoveForward(200 * fTimeElapsed);
	}*/

	if (m_bAiCanFire == false)
	{
		m_fMissleFireElapsed += fTimeElapsed;
		if (m_fMissleFireElapsed > m_fAfterFireFrequence)
		{
			m_bAiAfterFire = false;
		}
		if (m_fMissleFireElapsed > m_fMissleFireFrequence)
		{
			m_bAiCanFire = true;
			m_fMissleFireElapsed = 0.f;
		}
	}

	GET_MANAGER<AIManager>()->DoAction(AI_AIRCRAFT, this);
}

void CSuperCobraObject::CollisionActivate(CGameObject* collideTarget)
{
	if (collideTarget->m_ObjType == OBJ_ENEMY && m_bAllyCollide == false)
	{
		m_bAllyCollide = true;
		//SetPosition(XMFLOAT3(GetPosition().x, GetPosition().y+1, GetPosition().z));
		std::default_random_engine dre(time(NULL) * GetPosition().z);
		std::uniform_real_distribution<float>fYDegree(-90, 90);
		std::uniform_real_distribution<float>fXDegree(-90, 90);
		cout << fXDegree(dre) << " " << fYDegree(dre) << endl;
		m_xmf3Ai_ColideAxis = XMFLOAT3(fXDegree(dre), fYDegree(dre), fXDegree(dre));
	}
	else
	{
		if (collideTarget->m_ObjType == OBJ_ALLYBULLET || collideTarget->m_ObjType == OBJ_ALLYMISSLE)
		{
			wcout << GET_MANAGER<ObjectManager>()->GetTagFromObj(this, OBJ_ENEMY) << endl;
			cout << "Ãæµ¹!" << endl;
			m_isDead = true;
			m_pUI->m_isDead = true;
			m_pLockOnUI->m_isDead = true;
		}
	}
}

void CSuperCobraObject::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	//if (SphereCollider)SphereCollider->Render(pd3dCommandList, pCamera);
	CGameObject::Render(pd3dCommandList, pCamera);
}
