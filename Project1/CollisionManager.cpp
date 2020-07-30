#include "stdafx.h"
#include "CollisionManager.h"
#include "CGameObject.h"

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
			if (PlayerHeight < 200)
			{
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bGameOver = true;
				//GET_MANAGER<SceneManager>()->SetStoped(true);
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui16_navigator", OBJ_NAVIGATOR)->SetIsRender(false);
				for (auto i = (int)OBJ_MINIMAP_UI; i <= OBJ_UI; ++i)
				{
					if (i == OBJ_UI || i == OBJ_MINIMAP_UI)
					{
						for (auto p = GET_MANAGER<ObjectManager>()->GetObjFromType((OBJTYPE)i).begin(); p != GET_MANAGER<ObjectManager>()->GetObjFromType((OBJTYPE)i).end(); ++p)
						{
							(*p).second->SetIsRender(false);
						}
					}
				}

			}
		}
	}
}
