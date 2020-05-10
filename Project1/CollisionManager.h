#pragma once
#include "SingletonBase.h"

class CollisionManager : public SingletonBase<CollisionManager>
{
public:
	CollisionManager();
	virtual ~CollisionManager();

public:
	void CollisionSphere(ObjectManager::MAPOBJ* DstList, ObjectManager::MAPOBJ* SrcList);
	void CollisionSphereToBox(ObjectManager::MAPOBJ* DstList, ObjectManager::MAPOBJ* SrcList);

private:

	bool m_RenderCheck = false;
};

