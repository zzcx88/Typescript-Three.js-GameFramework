#pragma once
#include "SingletonBase.h"

class UIManager : public SingletonBase<UIManager>
{
	int speed_number = 0;
	int alt_number = 0;
	int missile_number = 0;
	int score_number = 0;

	float fElapsedTime = 60.f;

	int nMsecond = 60.0f;
	int nSecond = 0;
	int nMin = 0;

	int n_second = 29;
	int n_minute = 15;

	int nDistance = 0;

	int numObjects = 29;

	bool m_bFighterType = false;
	bool m_bNotSort = false;
	bool m_bLockOnSoundPlayed = false;

public:
	UIManager();
	virtual ~UIManager();
	//CGameObject** ppNumObjects = NULL;

	CCamera* m_pCamera = NULL;

	vector<CGameObject*> FighterOBJs, ShipOBJs;
	vector<int> speed, alt, missile, timeMS, timeS, timeM, score, distance{};

public:
	void MoveMinimapPoint(ObjectManager::MAPOBJ* PlyList, ObjectManager::MAPOBJ* EneList);
	void MoveLockOnUI(ObjectManager::MAPOBJ* PlyList, ObjectManager::MAPOBJ* EneList);
	void SetCamera(CCamera* pCamera) { m_pCamera = pCamera; }
	void NumberTextureAnimate(ObjectManager::MAPOBJ* PlyList, const float& TimeDelta);
	void ReleaseUI();
	void BuildNumberUI();

	CGameObject* m_fMin = NULL;
	int Count = 0;
};
