#pragma once
#include "SingletonBase.h"

class CollisionManager : public SingletonBase<CollisionManager>
{
public:
	CollisionManager();
	virtual ~CollisionManager();

private:
	bool CheckCollisionSphere(int* moveX, int* moveY, CGameObject* Dst, CGameObject* Src);
	bool m_RenderCheck = false;
};

