#include "stdafx.h"
#include "AIManager.h"


AIManager::AIManager()
{
}

AIManager::~AIManager()
{
}

void AIManager::LoadAction()
{
}

void AIManager::MakeAction(AITYPE aiType)
{
	if (aiType == AI_ESCORT)
	{
		BT::Sequence* root = new BT::Sequence(); // 루트 노드(시퀀스 노드로 생성)
		BT::Selector* selector = new BT::Selector(); // 셀렉터

		BT::Sequence* seqPatrol = new BT::Sequence(); // 정찰 시퀀스
		BT::Sequence* seqException = new BT::Sequence(); //예외 시퀀스
		BT::Sequence* seqAvoidAction = new BT::Sequence();
		BT::Sequence* seqMove = new BT::Sequence();

		BT::Sequence* seqOffence = new BT::Sequence();

		BT::CNode* BT_EnemyNear = new IsEnemyNear();
		BT::CNode* BT_MoveToEnemy = new MoveToEnemy();
		BT::CNode* BT_MoveException = new MoveException();
		BT::CNode* BT_LockON = new LockOn();
		BT::CNode* BT_Attack = new Attack();
		BT::CNode* BT_Evade = new Evade();

		root->AddChild(selector);
		selector->AddChild(seqException);
		selector->AddChild(seqPatrol);
		seqException->AddChild(BT_MoveException);
		seqPatrol->AddChild(BT_Evade);
		seqPatrol->AddChild(BT_EnemyNear);
		seqPatrol->AddChild(BT_MoveToEnemy);
		seqPatrol->AddChild(BT_LockON);
		seqPatrol->AddChild(BT_Attack);

		m_mapNode.insert(MAPNODE::value_type(AI_ESCORT, root->GetChildren()));
	}
	if (aiType == AI_BOMBER)
	{
		BT::Sequence* root = new BT::Sequence(); // 루트 노드(시퀀스 노드로 생성)
		BT::CNode* BT_MoveFoward = new MoveFoward();

		root->AddChild(BT_MoveFoward);
		m_mapNode.insert(MAPNODE::value_type(AI_BOMBER, root->GetChildren()));
	}
	if (aiType == AI_SHIP)
	{
	}
}

void AIManager::DoAction(AITYPE Type, CGameObject* pObj)
{
	if (!pObj->m_bAIEnable)
	{
		MakeAction(Type);
		pObj->m_bAIEnable = true;
	}
	NODELIST::iterator iter;
	iter = m_mapNode.find(Type)->second.begin();

	(*iter)->Invoke(pObj);
	/*while (!(*iter)->Invoke())
	{

	}*/
}
