#pragma once

template <class ClassName>
class SingletonBase
{
protected:
	SingletonBase() {}
	virtual ~SingletonBase() {}

public:
	static ClassName* GetIinstace()
	{
		if (nullptr == m_pInstance)
		{
			m_pInstance = new ClassName;
		}
		return m_pInstance;
	}
	void DestroyInstance()
	{
		if (m_pInstance)
		{
			delete m_pInstance;
			m_pInstance = nullptr;
		}
	}
private:
	static ClassName* m_pInstance;
};

template<class ClassName>
ClassName* SingletonBase<ClassName>::m_pInstance = nullptr;

template<class ClassName>
ClassName* GET_MANAGER()
{
	return SingletonBase<ClassName>::GetIinstace();
}
