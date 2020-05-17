#pragma once
#include "SingletonBase.h"

class CollisionManager : public SingletonBase<CollisionManager>
{
public:
	CollisionManager();
	virtual ~CollisionManager();

public:
	void CollisionSphere(ObjectManager::MAPOBJ* DstList, ObjectManager::MAPOBJ* SrcList);
	void CollisionSphereToOrientedBox(ObjectManager::MAPOBJ* DstList, ObjectManager::MAPOBJ* SrcList);
	void CollisionFloor();

private:

	bool m_RenderCheck = false;
};

