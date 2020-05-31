#pragma once
#include "SingletonBase.h"

class CollisionManager : public SingletonBase<CollisionManager>
{
public:
	CollisionManager();
	virtual ~CollisionManager();

public:
	void CollisionSphere(ObjectManager::MAPOBJ* DstList, ObjectManager::MAPOBJ* SrcList);
	void CollisionSphere(CGameObject* Dst, ObjectManager::MAPOBJ* Src);
	void CollisionSphereToOrientedBox(ObjectManager::MAPOBJ* DstList, ObjectManager::MAPOBJ* SrcList);
	void CollisionFloor();

private:

	bool m_RenderCheck = false;
};

