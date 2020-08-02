#include "stdafx.h"
#include "CollisionManager.h"
#include "CGameObject.h"
#include "CHeightMapTerrain.h"
#include "CMissleSplash.h"

CollisionManager::CollisionManager()
{
}

CollisionManager::~CollisionManager()
{
}

void CollisionManager::CollisionSphere(ObjectManager::MAPOBJ* DstList, ObjectManager::MAPOBJ* SrcList)
{
	for (auto& Dst : *DstList)
	{
		if (true == Dst.second->GetState())
			continue;

		for (auto& Src : *SrcList)
		{
			if (true == Src.second->GetState())
				continue;
			if (Dst.second->SphereCollider->m_BoundingSphere.Center.z != 0)
			{
				if (Dst.second->SphereCollider->m_BoundingSphere.Intersects(Src.second->SphereCollider->m_BoundingSphere))
				{
					Src.second->CollisionActivate(Dst.second);
					Dst.second->CollisionActivate(Src.second);
				}
			}
		}
	}
}

void CollisionManager::CollisionSphere(CGameObject* Dst, ObjectManager::MAPOBJ* SrcList)
{
	for (auto& Src : *SrcList)
	{
		if (Dst->SphereCollider->m_BoundingSphere.Center.z != 0)
		{
			if (Dst->SphereCollider->m_BoundingSphere.Intersects(Src.second->SphereCollider->m_BoundingSphere))
			{
				if (Src.second == Dst)
					return;
				Src.second->CollisionActivate(Dst);
				Dst->CollisionActivate(Src.second);
			}
		}
	}
}

void CollisionManager::CollisionSphereToOrientedBox(ObjectManager::MAPOBJ* DstList, ObjectManager::MAPOBJ* SrcList)
{
	for (auto& Dst : *DstList)
	{
		if (true == Dst.second->GetState())
			continue;

		for (auto& Src : *SrcList)
		{
			if (true == Src.second->GetState())
				continue;
			if (Src.second->OrientedBoxCollider != NULL)
			{
				if (Dst.second->SphereCollider->m_BoundingSphere.Intersects(Src.second->OrientedBoxCollider->m_BoundingBox))
				{
					Src.second->CollisionActivate(Dst.second);
					Dst.second->CollisionActivate(Src.second);
				}
			}
		}
	}
}

void CollisionManager::CollisionFloor()
{
	if (GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER))
	{
		float PlayerHeight = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().y;

		if (GET_MANAGER<SceneManager>()->GetCurrentSceneState() == SCENE_TEST)
		{
			if(PlayerHeight < 200.f)
			{
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bGameOver = true;
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->SetPosition(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().x,
					GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().y + 10,
					GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().z);

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
				pMissleSplash->SetPosition(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().x,
					GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().y + 100,
					GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().z);
				GET_MANAGER<ObjectManager>()->AddObject(L"MissleSplashInstance", pMissleSplash, OBJ_EFFECT);
			}
		
		}
	}
}

void CollisionManager::CollisionTerrain()
{
	if (GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER) && GET_MANAGER<ObjectManager>()->GetObjFromTag(L"terrain", OBJ_TEST))
	{
		float PlayerHeight = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().y;
		if (PlayerHeight < 1200)
		{
			CHeightMapTerrain* pTempTerrain = (CHeightMapTerrain*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"terrain", OBJ_TEST);
			float TerrainHeight = pTempTerrain->GetHeight(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().x + 20500,
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().z + 20500) - 1500;

			if (PlayerHeight <= TerrainHeight)
			{
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bGameOver = true;

				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->SetPosition(
					GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().x,
					GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().y + 10,
					GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().z);

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
				pMissleSplash->SetPosition(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_xmf4x4World._41,
					GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_xmf4x4World._42,
					GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_xmf4x4World._43);

				GET_MANAGER<ObjectManager>()->AddObject(L"MissleSplashInstance", pMissleSplash, OBJ_EFFECT);
			}
		}
	}
}

void CollisionManager::CollisionTerrainMissle(ObjectManager::MAPOBJ* SrcList)
{
	for (auto& Src : *SrcList)
	{
		if (true == Src.second->GetState())
			continue;
		CHeightMapTerrain* pTempTerrain = (CHeightMapTerrain*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"terrain", OBJ_TEST);
		float TerrainHeight = pTempTerrain->GetHeight(Src.second->GetPosition().x + 20500,
			Src.second->GetPosition().z + 20500) - 1500;


		if (Src.second->GetPosition().y <= TerrainHeight)
		{
			Src.second->CollisionActivate(pTempTerrain);
		}
	}
}

void CollisionManager::CollisionMapOut()
{
	if (GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER))
	{
		if ((GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().x > 20500 || GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().x < -20500)
			|| (GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().z > 20500 || GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().z < -20500))
		{
			GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bGameOver = true;
			GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->SetPosition(0,1000,0);
		}
	}
}
