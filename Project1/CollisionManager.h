#pragma once
#include "SingletonBase.h"

class CollisionManager : public SingletonBase<CollisionManager>
{
public:
	CollisionManager();
	virtual ~CollisionManager();

public:
	void CollisionSphere(ObjectManager::MAPOBJ* DstList, ObjectManager::MAPOBJ* SrcList);
	//void CollisionBox(ObjectManager::MAPOBJ* DstList, ObjectManager::MAPOBJ* SrcList);
	//void CollisionGround(ObjectManager::MAPOBJ* DstList, ObjectManager::MAPOBJ* SrcList);

private:
	//bool CheckCollisionSphere(int* moveX, int* moveY, CGameObject* Dst, CGameObject* Src);

	bool m_RenderCheck = false;
};

