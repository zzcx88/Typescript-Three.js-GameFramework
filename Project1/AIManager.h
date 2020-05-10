#pragma once
#include "SingletonBase.h"
#include "CNode.h"

class CNode;
class AIManager : public SingletonBase<AIManager>
{
public:
	AIManager();
	virtual ~AIManager();

public:
	CGameObject* m_pActorObject;
public:
	typedef list<BT::CNode*> NODELIST;
	typedef std::unordered_multimap<AITYPE , NODELIST>	MAPNODE;

	const NODELIST& GetAIFromType(AITYPE AIType) { return m_mapNode.find(AIType)->second; }

	//행동 정보를 읽어온다.
	void LoadAction();
	//읽어온 정보를 행동트리로 만든다.
	void MakeAction();
	//만들어진 행동트리를 실행한다
	void DoAction(AITYPE Type, CGameObject* pObj);

private:
	std::unordered_multimap<AITYPE, NODELIST>			m_mapNode;
};

