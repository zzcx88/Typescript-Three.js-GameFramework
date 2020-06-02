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

void AIManager::MakeAction()
{
	BT::Sequence* root = new BT::Sequence(); // ·çÆ® ³ëµå(½ÃÄö½º ³ëµå·Î »ý¼º)
	BT::Selector* selector = new BT::Selector(); // ¼¿·ºÅÍ

	BT::Sequence* seqPatrol = new BT::Sequence(); // Á¤Âû ½ÃÄö½º
	BT::Sequence* seqException = new BT::Sequence(); //¿¹¿Ü ½ÃÄö½º
	BT::Sequence* seqAvoidAction = new BT::Sequence(); 
	BT::Sequence* seqMove = new BT::Sequence();

	BT::Sequence* seqOffence = new BT::Sequence();

	BT::CNode* BT_EnemyNear = new IsEnemyNear();
	BT::CNode* BT_MoveToEnemy = new MoveToEnemy();
	BT::CNode* BT_MoveException = new MoveException();
	BT::CNode* BT_LockON = new LockOn();
	BT::CNode* BT_Attack = new Attack();
	
	root->AddChild(selector);
	selector->AddChild(seqException);
	selector->AddChild(seqPatrol);
	seqException->AddChild(BT_MoveException);
	seqPatrol->AddChild(BT_EnemyNear);
	seqPatrol->AddChild(BT_MoveToEnemy);
	seqPatrol->AddChild(BT_LockON);
	seqPatrol->AddChild(BT_Attack);

	m_mapNode.insert(MAPNODE::value_type(AI_AIRCRAFT, root->GetChildren()));
}

void AIManager::DoAction(AITYPE Type, CGameObject* pObj)
{
	if (!pObj->m_bAIEnable)
	{
		MakeAction();
		pObj->m_bAIEnable = true;
	}
	NODELIST::iterator iter;
	iter = m_mapNode.find(AI_AIRCRAFT)->second.begin();

	(*iter)->Invoke(pObj);
	/*while (!(*iter)->Invoke())
	{

	}*/
}
