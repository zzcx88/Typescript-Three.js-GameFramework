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
			cout << Lenth << endl;
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
		XMFLOAT3 xmf3Pos, xmf3PlayerPos, xmf3TargetVector;
		xmf3Pos = pObj->GetPosition();
		xmf3PlayerPos = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition();
		xmf3TargetVector = Vector3::Subtract(xmf3Pos, xmf3PlayerPos);
		float Lenth = sqrt(xmf3TargetVector.x * xmf3TargetVector.x + xmf3TargetVector.y * xmf3TargetVector.x + xmf3TargetVector.z * xmf3TargetVector.z);

		if (Lenth < 3000)
		{
			cout << Lenth << endl;
			return true;
		}
		else
			return false;
	}
};