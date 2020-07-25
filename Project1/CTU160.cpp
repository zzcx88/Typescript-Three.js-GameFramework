#include "stdafx.h"
#include "CTU160.h"
#include "CUI.h"
#include "CLockOnUI.h"
#include "CMissleFog.h"
#include "CMissleSplash.h"
#include "CCrushSmoke.h"

CTU160::CTU160()
{
	m_bReffernce = false;
	m_ObjManager = GET_MANAGER<ObjectManager>();
	m_pModelInfo = m_ObjManager->GetObjFromTag(L"tu160Ref", OBJ_ENEMY)->m_pModelInfo;

	SphereCollider = new CSphereCollider();
	SphereCollider->SetSphereCollider(GetPosition(), 110);
	SphereCollider->SetScale(110, 110, 110);

	SetChild(m_pModelInfo->m_pModelRootObject);
	SetScale(10.f, 10.f, 10.f);

	m_fHP = 100;
}

CTU160::CTU160(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature)
{
	m_bReffernce = true;
	m_ObjManager = GET_MANAGER<ObjectManager>();
	m_pModelInfo = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature, "Model/TU-160_root.bin", NULL, MODEL_STD);
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

CTU160::~CTU160()
{
}

void CTU160::OnPrepareAnimate()
{
	m_pLeftEngine1 = FindFrame("Left_Engine1");
	m_pLeftEngine2 = FindFrame("Left_Engine2");
	m_pRightEngine1 = FindFrame("Right_Engine1");
	m_pRightEngine2 = FindFrame("Right_Engine2");
}

void CTU160::Animate(float fTimeElapsed)
{
	if (GetPosition().z <= 10000.f)
		GET_MANAGER<SceneManager>()->m_bStageFail = true;

	/*if (m_pLeftEngine1 == NULL)
	{
		OnPrepareAnimate();
	}*/
	m_fAddFogTimeElapsed += fTimeElapsed;
	m_xmf3Position.x = m_xmf4x4ToParent._41;
	m_xmf3Position.y = m_xmf4x4ToParent._42;
	m_xmf3Position.z = m_xmf4x4ToParent._43;
	/*if (m_bAiContrail == true)
	{
		if (m_fAddFogTimeElapsed > m_fAddFogFrequence)
		{
			if (m_pLeftEngine1)
			{
				CMissleFog* pMissleFog;
				pMissleFog = new CMissleFog();
				pMissleFog->m_fScaleX = 3;
				pMissleFog->m_fScaleY = 3;
				pMissleFog->m_fBurnerBlendAmount = 0.5f;
				pMissleFog->m_pCamera = m_ObjManager->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera;
				pMissleFog->SetMesh(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pPlaneMesh);
				pMissleFog->m_pEffectMaterial = new CMaterial(1);
				pMissleFog->m_pEffectMaterial->SetTexture(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pEffectTexture[0]);
				pMissleFog->m_pEffectMaterial->SetShader(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_EffectShader);
				pMissleFog->SetMaterial(0, pMissleFog->m_pEffectMaterial);
				pMissleFog->SetPosition(m_pLeftEngine1->GetPosition());
				pMissleFog->m_bEffectedObj = true;
				pMissleFog->m_bWingFog = true;
				m_ObjManager->AddObject(L"MissleFogInstance", pMissleFog, OBJ_EFFECT);
			}
			if (m_pLeftEngine2)
			{
				CMissleFog* pMissleFog;
				pMissleFog = new CMissleFog();
				pMissleFog->m_fScaleX = 3;
				pMissleFog->m_fScaleY = 3;
				pMissleFog->m_fBurnerBlendAmount = 0.5f;
				pMissleFog->m_pCamera = m_ObjManager->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera;
				pMissleFog->SetMesh(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pPlaneMesh);
				pMissleFog->m_pEffectMaterial = new CMaterial(1);
				pMissleFog->m_pEffectMaterial->SetTexture(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pEffectTexture[0]);
				pMissleFog->m_pEffectMaterial->SetShader(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_EffectShader);
				pMissleFog->SetMaterial(0, pMissleFog->m_pEffectMaterial);
				pMissleFog->SetPosition(m_pLeftEngine2->GetPosition());
				pMissleFog->m_bEffectedObj = true;
				pMissleFog->m_bWingFog = true;
				m_ObjManager->AddObject(L"MissleFogInstance", pMissleFog, OBJ_EFFECT);
			}
			if (m_pRightEngine1)
			{
				CMissleFog* pMissleFog;
				pMissleFog = new CMissleFog();
				pMissleFog->m_fScaleX = 3;
				pMissleFog->m_fScaleY = 3;
				pMissleFog->m_fBurnerBlendAmount = 0.5f;
				pMissleFog->m_pCamera = m_ObjManager->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera;
				pMissleFog->SetMesh(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pPlaneMesh);
				pMissleFog->m_pEffectMaterial = new CMaterial(1);
				pMissleFog->m_pEffectMaterial->SetTexture(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pEffectTexture[0]);
				pMissleFog->m_pEffectMaterial->SetShader(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_EffectShader);
				pMissleFog->SetMaterial(0, pMissleFog->m_pEffectMaterial);
				pMissleFog->SetPosition(m_pRightEngine1->GetPosition());
				pMissleFog->m_bEffectedObj = true;
				pMissleFog->m_bWingFog = true;
				m_ObjManager->AddObject(L"MissleFogInstance", pMissleFog, OBJ_EFFECT);
			}
			if (m_pRightEngine2)
			{
				CMissleFog* pMissleFog;
				pMissleFog = new CMissleFog();
				pMissleFog->m_fScaleX = 3;
				pMissleFog->m_fScaleY = 3;
				pMissleFog->m_fBurnerBlendAmount = 0.5f;
				pMissleFog->m_pCamera = m_ObjManager->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera;
				pMissleFog->SetMesh(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pPlaneMesh);
				pMissleFog->m_pEffectMaterial = new CMaterial(1);
				pMissleFog->m_pEffectMaterial->SetTexture(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pEffectTexture[0]);
				pMissleFog->m_pEffectMaterial->SetShader(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_EffectShader);
				pMissleFog->SetMaterial(0, pMissleFog->m_pEffectMaterial);
				pMissleFog->SetPosition(m_pRightEngine2->GetPosition());
				pMissleFog->m_bEffectedObj = true;
				pMissleFog->m_bWingFog = true;
				m_ObjManager->AddObject(L"MissleFogInstance", pMissleFog, OBJ_EFFECT);
			}
			m_fAddFogTimeElapsed = 0;
		}
	}*/

	CGameObject::Animate(fTimeElapsed);
	if (SphereCollider)SphereCollider->SetPosition(GetPosition());
	if (SphereCollider)SphereCollider->m_xmf4x4ToParent = Matrix4x4::Multiply(XMMatrixScaling(110, 110, 110), m_xmf4x4ToParent);
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

	if (m_bReffernce == false && m_bDestroyed == false)
	{
		GET_MANAGER<AIManager>()->DoAction(AI_BOMBER, this);
		UpdateTransform();
	}

	if (m_bDestroyed == true)
	{
		m_fAddCrushFogTimeElapsed += fTimeElapsed;
		XMFLOAT3 xmf3TargetVector = Vector3::Subtract(m_xmf3FallingPoint, GetPosition());
		xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
		XMFLOAT3 xmfAxis = Vector3::CrossProduct(m_xmf3Look, xmf3TargetVector);
		xmfAxis = Vector3::Normalize(xmfAxis);
		RotateFallow(&xmfAxis, 50 * fTimeElapsed);
		Move(DIR_FORWARD, 300 * fTimeElapsed, false);

		if (m_fAddCrushFogTimeElapsed > m_fAddCrushFogFrequence)
		{
			CCrushSmoke* pMissleFog;
			pMissleFog = new CCrushSmoke();
			pMissleFog->m_fBurnerBlendAmount = 1.f;
			pMissleFog->m_fScaleX = 5;
			pMissleFog->m_fScaleY = 5;
			pMissleFog->m_pCamera = m_ObjManager->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera;
			pMissleFog->SetMesh(m_ObjManager->GetObjFromTag(L"crushsmokeRef", OBJ_EFFECT)->m_pPlaneMesh);
			pMissleFog->m_pEffectMaterial = new CMaterial(1);
			pMissleFog->m_pEffectMaterial->SetTexture(m_ObjManager->GetObjFromTag(L"crushsmokeRef", OBJ_EFFECT)->m_pEffectTexture[0]);
			pMissleFog->m_pEffectMaterial->SetShader(m_ObjManager->GetObjFromTag(L"crushsmokeRef", OBJ_EFFECT)->m_EffectShader);
			pMissleFog->SetMaterial(0, pMissleFog->m_pEffectMaterial);
			pMissleFog->SetPosition(m_xmf3Position);
			pMissleFog->m_bEffectedObj = true;
			m_ObjManager->AddObject(L"crushsmoke", pMissleFog, OBJ_EFFECT);

			m_fAddCrushFogTimeElapsed = 0;
		}
	}
}

void CTU160::CollisionActivate(CGameObject* collideTarget)
{
	if (m_bReffernce == false && m_bDestroyed == false)
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
				std::default_random_engine dre(time(NULL) * GetPosition().z);
				std::uniform_real_distribution<float>fXPos(-400, 400);
				std::uniform_real_distribution<float>fZPos(200, 400);
				m_xmf3FallingPoint = XMFLOAT3(GetPosition().x + fXPos(dre), -200.f, GetPosition().z + fZPos(dre));

				m_bDestroyed = true;
				m_pMUI->m_bDestroyed = true;
				m_pLockOnUI->m_bDestroyed = true;
			}
		}
	}
}

void CTU160::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	//if (SphereCollider)SphereCollider->Render(pd3dCommandList, pCamera);
	if (m_bDestroyed == true)
	{
		//cout << m_fDeadElapsed << endl;
		m_fDeadElapsed += 1.f * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed();

		if (m_fDeadElapsed >= 3 && m_bCreateOnece == false)
		{
			GET_MANAGER<SoundManager>()->PlaySound(L"Splash.mp3", CH_SPLASH);

			m_bCreateOnece = true;
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
		}

		if (m_fDeadElapsed >= m_fDeadFrequence)
		{
			if (m_isDead == false)
			{
				GET_MANAGER<SceneManager>()->m_nTgtObject--;
				cout << GET_MANAGER<SceneManager>()->m_nTgtObject << endl;
				m_isDead = true;
				m_pMUI->m_isDead = true;
				m_pLockOnUI->m_isDead = true;
			}
		}
	}	

	CGameObject::Render(pd3dCommandList, pCamera);
}
