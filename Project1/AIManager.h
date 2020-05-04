#pragma once
#include "SingletonBase.h"

class AIManager : public SingletonBase<AIManager>
{
public:
	AIManager();
	virtual ~AIManager();

public:
	CGameObject* m_pActorObject;
public:
	typedef std::unordered_multimap<const TCHAR*, CGameObject*>	MAPTREE;

	//행동 정보를 읽어온다.
	void LoadAction();
	//읽어온 정보를 행동트리로 만든다.
	void MakeAction();
	//만들어진 행동트리를 실행한다
	void DoAction();
	
};

