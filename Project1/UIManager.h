#pragma once
#include "SingletonBase.h"

class UIManager : public SingletonBase<UIManager>
{
public:
	UIManager();
	virtual ~UIManager();

	CCamera* m_pCamera = NULL;

public:
	void MoveMinimapPoint(ObjectManager::MAPOBJ* PlyList, ObjectManager::MAPOBJ* EneList);
	void MoveLockOnUI(ObjectManager::MAPOBJ* PlyList, ObjectManager::MAPOBJ* EneList);

	void SetCamera(CCamera* pCamera) { m_pCamera = pCamera; }

	float m_fMinLenth = 100000.f;
	int Count = 0;
	
	bool bLockOn = false;
};
