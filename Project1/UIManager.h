#pragma once
#include "SingletonBase.h"

class UIManager : public SingletonBase<UIManager>
{
public:
	UIManager();
	virtual ~UIManager();

	CCamera* m_pCamera = NULL;

	vector<CGameObject*> GameOBJs;

public:
	void MoveMinimapPoint(ObjectManager::MAPOBJ* PlyList, ObjectManager::MAPOBJ* EneList);
	void MoveLockOnUI(ObjectManager::MAPOBJ* PlyList, ObjectManager::MAPOBJ* EneList);

	void SetCamera(CCamera* pCamera) { m_pCamera = pCamera; }

	CGameObject* m_fMin = NULL;
	int Count = 0;
	
	bool bLockOn = false;
};
