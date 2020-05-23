#pragma once
#include "SingletonBase.h"

class UIManager : public SingletonBase<UIManager>
{
	int speed_number = 0;
	int alt_number = 0;
	int missile_number = 0;
	int score_number = 0;

	float fElapsedTime = 60.f;
	int nSecond = 60.0f;
	int nMinute = 0;
	int nHour = 0;

	int n_Minute = 29;
	int n_Hour = 15;

	int numObjects = 0;
	CGameObject** ppNumObjects = NULL;

public:
	UIManager();
	virtual ~UIManager();

	CCamera* m_pCamera = NULL;

	vector<CGameObject*> GameOBJs;
	vector<int> speed, alt, missile, timeS, timeM, timeH, score{};

public:
	void MoveMinimapPoint(ObjectManager::MAPOBJ* PlyList, ObjectManager::MAPOBJ* EneList);
	void MoveLockOnUI(ObjectManager::MAPOBJ* PlyList, ObjectManager::MAPOBJ* EneList);
	void SetCamera(CCamera* pCamera) { m_pCamera = pCamera; }
	void NumberTextureAnimate(ObjectManager::MAPOBJ* PlyList, const float& TimeDelta);

	CGameObject* m_fMin = NULL;
	int Count = 0;
};
