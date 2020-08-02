#pragma once

class CGameObject;
namespace BT
{
	class CNode
	{
	public:
		virtual bool Invoke(CGameObject* pObj) = 0;
	};

	class CompositeNode : public CNode
	{
	public:
		void AddChild(CNode* node)
		{
			mChildren.emplace_back(node);
		}
		const list<CNode*>& GetChildren()
		{
			return mChildren;
		}
	private:
		list<CNode*> mChildren;
	};


	class Selector : public CompositeNode
	{
	public:
		virtual bool Invoke(CGameObject* pObj) override
		{
			for (auto node : GetChildren())
			{
				if (node->Invoke(pObj))
					return true;
			}
			return false;
		}
	};


	class Sequence : public CompositeNode
	{
	public:
		virtual bool Invoke(CGameObject* pObj) override
		{
			for (auto node : GetChildren())
			{
				if (!node->Invoke(pObj))
					return false;
			}
			return true;
		}
	};
}

class MoveFoward : public BT::CompositeNode
{
public:
	MoveFoward() {}
	virtual ~MoveFoward() {}

public:
	virtual bool Invoke(CGameObject* pObj) override
	{
		if (pObj->m_AiType == AI_BOMBER)
		{
			pObj->Move(DIR_FORWARD, 270 * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed(), false);
			return true;
		}
		else if (pObj->m_AiType == AI_SHIP)
		{
			if (pObj->m_bAiDetected == false)
			{
				pObj->Move(DIR_FORWARD, 30 * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed(), false);
			}
			return true;
		}
	}
};

class IsEnemyNear : public BT::CompositeNode
{
public:
	IsEnemyNear() {}
	virtual ~IsEnemyNear() {}

public:
	virtual bool Invoke(CGameObject* pObj) override
	{
		//cout << "IsEnemyNear" << endl;
		if (pObj->m_AiType == AI_ESCORT)
		{
			XMFLOAT3 xmf3Pos, xmf3PlayerPos, xmf3TargetVector;
			xmf3Pos = pObj->GetPosition();
			xmf3PlayerPos = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition();
			xmf3TargetVector = Vector3::Subtract(xmf3Pos, xmf3PlayerPos);
			float Lenth = Vector3::Length(xmf3TargetVector);

			if (Lenth < 3000)
			{
				if (pObj->m_bAiDetected == false)
					pObj->m_bAiDetected = true;
				return true;
			}
			else
			{
				if (pObj->m_bAiDetected == true)
				{
					pObj->m_bAiLockOn = false;
					XMFLOAT3 xmf3Pos, xmf3PlayerPos, xmf3TargetVector;
					xmf3Pos = pObj->GetPosition();
					xmf3PlayerPos = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition();

					float theta = 50.f * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed();
					xmf3TargetVector = Vector3::Subtract(xmf3PlayerPos, xmf3Pos);
					xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
					XMFLOAT3 xmfAxis = Vector3::CrossProduct(pObj->m_xmf3Look, xmf3TargetVector);
					xmfAxis = Vector3::Normalize(xmfAxis);
					pObj->Move(DIR_FORWARD, 270 * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed(), false);
					pObj->RotateFallow(&xmfAxis, theta);
					return false;
				}
				pObj->Move(DIR_FORWARD, 270 * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed(), false);
				return false;
			}
		}
		else if (pObj->m_AiType == AI_SHIP)
		{
			XMFLOAT3 xmf3Pos, xmf3PlayerPos, xmf3TargetVector;
			xmf3Pos = pObj->GetPosition();
			xmf3PlayerPos = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition();
			xmf3TargetVector = Vector3::Subtract(xmf3Pos, xmf3PlayerPos);
			float Lenth = Vector3::Length(xmf3TargetVector);

			if (Lenth < 5000)
			{
				if (pObj->m_bAiDetected == false)
				{
					pObj->m_bAiDetected = true;
				}
				return true;
			}
			else
			{
				pObj->m_bAiDetected = false;
				return false;
			}
		}
	}
};

class MoveToEnemy : public BT::CompositeNode
{
public:
	MoveToEnemy() {}
	virtual ~MoveToEnemy() {}

public:
	virtual bool Invoke(CGameObject* pObj) override
	{
		//cout << "MoveToEnemy" << endl;
		if (pObj->m_bAllyCollide == true || pObj->m_bAiAfterFire == true)
			return false;
		XMFLOAT3 xmf3Pos, xmf3PlayerPos, xmf3TargetVector;
		xmf3Pos = pObj->GetPosition();
		xmf3PlayerPos = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition();

		float theta = 20.f * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed();
		xmf3TargetVector = Vector3::Subtract(xmf3PlayerPos, xmf3Pos);
		xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
		XMFLOAT3 xmfAxis = Vector3::CrossProduct(pObj->m_xmf3Look, xmf3TargetVector);
		xmfAxis = Vector3::Normalize(xmfAxis);
		pObj->m_bAiContrail = false;
		pObj->Move(DIR_FORWARD, 230 * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed(), false);
		pObj->RotateFallow(&xmfAxis, theta);
		return true;
	}
};

class MoveException : public BT::CompositeNode
{
public:
	MoveException() {}
	virtual ~MoveException() {}

public:
	virtual bool Invoke(CGameObject* pObj) override
	{
		pObj->m_bAiContrail = true;
		//고도가 낮다면 고도를 상승시킨다.
		if (pObj->GetPosition().y < 1450.f)
		{
			//cout << "MoveException" << endl;
			XMFLOAT3 xmf3Pos, xmf3TargetPos, xmf3PlayerPos, xmf3TargetVector;
			xmf3Pos = pObj->GetPosition();
			xmf3PlayerPos = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition();
			xmf3TargetPos = XMFLOAT3(xmf3PlayerPos.x, 1800, xmf3PlayerPos.z);

			float theta = 50.f * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed();
			xmf3TargetVector = Vector3::Subtract(xmf3TargetPos, xmf3Pos);
			xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
			XMFLOAT3 xmfAxis = Vector3::CrossProduct(pObj->m_xmf3Look, xmf3TargetVector);
			xmfAxis = Vector3::Normalize(xmfAxis);
			pObj->Move(DIR_FORWARD, 230 * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed(), false);
			pObj->RotateFallow(&xmfAxis, theta);
			return true;
		}
		//근처에 아군이 있다면 적당한 방향으로 벗어난다
		if (pObj->m_bAllyCollide == true)
		{
			pObj->Move(DIR_FORWARD, 230 * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed(), false);
			return true;
		}
		return false;
	}
};

//적이 내적 범위에 들어오면 적에게 락온 신호를 보낸다.
class LockOn : public BT::CompositeNode
{
public:
	LockOn() {}
	virtual ~LockOn() {}

public:
	virtual bool Invoke(CGameObject* pObj) override
	{
		if (pObj->m_bAiLockOn == false)
		{
			//cout << "LockOn" << endl;
			//pObj->m_b_AiCanFire = false;
			XMFLOAT3 xmf3TargetVector = Vector3::Subtract(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition(), pObj->GetPosition());
			xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
			float xmfAxis = Vector3::DotProduct(pObj->GetLook(), xmf3TargetVector);
			if ((xmfAxis > 0.9f || xmfAxis < -0.9f) && xmfAxis > 0.f)
			{
				pObj->m_bAiLockOn = true;
				return true;
			}
		}
		else
		{
			pObj->m_bAiLockOn = false;
			return false;
		}
	}
};

//미사일, 기총 을 발사한다.
class Attack : public BT::CompositeNode
{
public:
	Attack() {}
	virtual ~Attack() {}

public:
	virtual bool Invoke(CGameObject* pObj) override
	{
		if (pObj->m_AiType == AI_ESCORT)
		{
			if (pObj->m_bAiLockOn == true && pObj->m_bAiCanFire == true)
			{
				//cout << "Attack" << endl;
				pObj->m_bAiCanFire = false;
				pObj->m_bAiAfterFire = true;
				CMissle* pMissle;
				XMFLOAT3* temp;
				temp = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPositionForMissle();
				pMissle = new CMissle(pObj);
				pMissle->m_xmfTarget = temp;
				pMissle->m_bLockOn = true;
				pMissle->SetPosition(pObj->GetPosition());
				pMissle->m_bLaunchFromAircraft = true;
				GET_MANAGER<ObjectManager>()->AddObject(L"enemy_missle", pMissle, OBJ_ENEMISSLE);
				return true;
			}
		}
		else if (pObj->m_AiType == AI_SHIP)
		{
			if (pObj->m_bAiDetected == true && pObj->m_bAiCanFire == true)
			{
				pObj->m_bAiCanFire = false;
				pObj->m_bAiAfterFire = true;
				CMissle* pMissle;
				XMFLOAT3* temp;
				temp = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPositionForMissle();
				pMissle = new CMissle(pObj);
				pMissle->m_xmfTarget = temp;
				pMissle->m_bLockOn = true;
				pMissle->SetPosition(pObj->GetPosition());
				pMissle->m_xmf3Look = XMFLOAT3(0, 1, 0);
				pMissle->m_bLaunchFromShip = true;
				pMissle->m_fDeleteFrequence = 6.f;
				GET_MANAGER<ObjectManager>()->AddObject(L"enemy_missle", pMissle, OBJ_ENEMISSLE);
				return true;
			}
		}
		else
			return false;
	}
};

//회피한다(회전한다)
class Evade : public BT::CompositeNode
{
public:
	Evade() {}
	virtual ~Evade() {}

public:
	virtual bool Invoke(CGameObject* pObj) override
	{
		if (pObj->m_bAiCanFire == false && pObj->m_bAiAfterFire == true)
		{
			if (pObj->m_xmf3Ai_EvadeAxis.y == 0)
			{
				pObj->m_bAiContrail = true;
				std::default_random_engine dre(time(NULL) * pObj->GetPosition().z);
				std::uniform_real_distribution<float>fYDegree(-90, 90);
				std::uniform_real_distribution<float>fXDegree(-90, 90);
				std::uniform_real_distribution<float>fZDegree(-90, 90);
				//cout << fXDegree(dre) << " " << fYDegree(dre) << endl;
				pObj->m_xmf3Ai_EvadeAxis = XMFLOAT3(fXDegree(dre), fYDegree(dre), fZDegree(dre));
			}
			//cout << "Evade" << endl;
			float theta = 20 * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed();
			pObj->Move(DIR_FORWARD, 200 * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed(), false);
			pObj->RotateFallow(&pObj->m_xmf3Ai_EvadeAxis, theta);
			return true;
		}
		return true;
	}
};

//지정한 위치로 움직인다.
class MoveToPoint : public BT::CompositeNode
{
public:
	MoveToPoint() {}
	virtual ~MoveToPoint() {}

public:
	virtual bool Invoke(CGameObject* pObj) override
	{
		if (pObj->m_bAllyCollide == true || pObj->m_bAiAfterFire == true)
			return false;
		XMFLOAT3 xmf3Pos, xmf3TagetPos, xmf3TargetVector;
		xmf3Pos = pObj->GetPosition();
		xmf3TagetPos = pObj->m_xmf3TargetPos;

		float theta = 50.f * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed();
		xmf3TargetVector = Vector3::Subtract(xmf3TagetPos, xmf3Pos);
		xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
		XMFLOAT3 xmfAxis = Vector3::CrossProduct(pObj->m_xmf3Look, xmf3TargetVector);
		xmfAxis = Vector3::Normalize(xmfAxis);
		pObj->Move(DIR_FORWARD, 230 * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed(), false);
		pObj->RotateFallow(&xmfAxis, theta);
	}
};

//정지한다(배, 지상 오브젝트에 한함).
class Stop : public BT::CompositeNode
{
public:
	Stop() {}
	virtual ~Stop() {}

public:
	virtual bool Invoke(CGameObject* pObj) override
	{
		pObj->Move(DIR_FORWARD, 0 * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed(), false);
		return true;
	}
};