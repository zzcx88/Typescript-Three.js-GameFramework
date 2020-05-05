#pragma once

namespace BT
{
	class CNode
	{
	public:
		virtual bool Invoke() = 0;
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
		virtual bool Invoke() override
		{
			for (auto node : GetChildren())
			{
				if (node->Invoke())
					return true;
			}
			return false;
		}
	};


	class Sequence : public CompositeNode
	{
	public:
		virtual bool Invoke() override
		{
			for (auto node : GetChildren())
			{
				if (!node->Invoke())
					return false;
			}
			return true;
		}
	};
}

