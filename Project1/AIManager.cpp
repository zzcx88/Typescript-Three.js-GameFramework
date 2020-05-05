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
	BT::Sequence* root = new BT::Sequence(); // 루트 노드(시퀀스 노드로 생성)
	BT::Selector* selector = new BT::Selector(); // 셀렉터
	BT::Sequence* seqFindPlayer = new BT::Sequence(); // 플레이어를 찾는 시퀀스
	BT::Sequence* seqMoveToPlayer = new BT::Sequence(); // 플레이어에게 이동하는 시퀀스
	root->AddChild(selector);
	selector->AddChild(seqFindPlayer);
	selector->AddChild(seqMoveToPlayer);

	m_mapNode.insert(MAPNODE::value_type(AI_AIRCRAFT, root->GetChildren()));
}

void AIManager::DoAction(AITYPE Type)
{
}
