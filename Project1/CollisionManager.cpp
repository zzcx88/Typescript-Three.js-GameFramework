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

void CollisionManager::CollisionSphereToBox(ObjectManager::MAPOBJ* DstList, ObjectManager::MAPOBJ* SrcList)
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
