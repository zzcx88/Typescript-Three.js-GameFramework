#pragma once
#include "SingletonBase.h"

class KeyManager : public SingletonBase<KeyManager>
{
public:
	KeyManager();
	virtual ~KeyManager();

public:
	const bool GetKeyState(const KEYSTATE& KeyState, const int& VirtualKey);

public:
	void SetRunning(const bool& check) { m_IsRunning = check; }

public:
	int UpdateKey();

private:
	void ComputeKeyState(const int& VirtualKey);

private:

	bool m_KeyArr[STATE_END][KEY_MAX];
	bool m_IsRunning = true;
};

