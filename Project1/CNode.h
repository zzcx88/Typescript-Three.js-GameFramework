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

class IsEnemyNear : public BT::CompositeNode
{
public:
	IsEnemyNear() {}
	virtual ~IsEnemyNear(){}

public:
	virtual bool Invoke(CGameObject* pObj) override
	{
		XMFLOAT3 xmf3Pos, xmf3PlayerPos, xmf3TargetVector;
		xmf3Pos = pObj->GetPosition();
		xmf3PlayerPos = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition();
		xmf3TargetVector = Vector3::Subtract(xmf3Pos, xmf3PlayerPos);
		float Lenth = sqrt(xmf3TargetVector.x * xmf3TargetVector.x + xmf3TargetVector.y * xmf3TargetVector.x + xmf3TargetVector.z * xmf3TargetVector.z);

		if (Lenth < 3000)
		{
			//cout << Lenth << endl;
			return true;
		}
		else
			return false;
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
		if (pObj->m_bAllyCollide == true)
			return false;
		XMFLOAT3 xmf3Pos, xmf3PlayerPos, xmf3TargetVector;
		xmf3Pos = pObj->GetPosition();
		xmf3PlayerPos = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition();

		/*float Lenth = sqrt(xmf3TargetVector.x * xmf3TargetVector.x + xmf3TargetVector.y * xmf3TargetVector.x + xmf3TargetVector.z * xmf3TargetVector.z);
		cout << Lenth << endl;*/

		float theta = 50.f * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed();
		xmf3TargetVector = Vector3::Subtract(xmf3PlayerPos, xmf3Pos);
		xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
		XMFLOAT3 xmfAxis = Vector3::CrossProduct(pObj->m_xmf3Look, xmf3TargetVector);
		xmfAxis = Vector3::Normalize(xmfAxis);
		pObj->Move(DIR_FORWARD, 200 * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed() , false);
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
		//고도가 낮다면 고도를 상승시킨다.
		if (pObj->GetPosition().y < 1450.f)
		{
			XMFLOAT3 xmf3Pos, xmf3TargetPos, xmf3PlayerPos, xmf3TargetVector;
			xmf3Pos = pObj->GetPosition();
			xmf3PlayerPos = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition();
			xmf3TargetPos = XMFLOAT3(xmf3PlayerPos.x,1800, xmf3PlayerPos.z);

			float theta = 50.f * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed();
			xmf3TargetVector = Vector3::Subtract(xmf3TargetPos, xmf3Pos);
			xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
			XMFLOAT3 xmfAxis = Vector3::CrossProduct(pObj->m_xmf3Look, xmf3TargetVector);
			xmfAxis = Vector3::Normalize(xmfAxis);
			pObj->Move(DIR_FORWARD, 200 * GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed(), false);
			pObj->RotateFallow(&xmfAxis, theta);
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

//기수를 상부로 돌린다.

//적이 내적 범위에 들어오면 적에게 락온 신호를 보낸다.

//미사일, 기총 을 발사한다.

//회피한다(회전한다)

//지정한 위치로 움직인다.

//정지한다(배, 지상 오브젝트에 한함).
