#pragma once
#include "SingletonBase.h"

class KeyManager : public SingletonBase<KeyManager>
{
public:
	KeyManager();
	virtual ~KeyManager();

public:
	const bool GetKeyState(const KEYSTATE& KeyState, const int& VirtualKey);
	const bool GetPadState(const KEYSTATE& KeyState, const WORD& VirtualKey);

public:
	void SetRunning(const bool& check) { m_IsRunning = check; }

public:
	int UpdateKey();

	float ComputePadLeftTrigerState();
	float ComputePadRightTrigerState();
	float ComputePadLStickState();

	CXBOXController* m_pPadConnecter;

	float normalizedLX;
	float normalizedLY;

private:
	void ComputeKeyState(const int& VirtualKey);
	void ComputePadState(const WORD& VirtualKey);
	bool isPressedPad(const WORD& VirtualButton);
	bool wasPressedPad(const WORD& VirtualButton);

private:

	bool m_KeyArr[STATE_END][KEY_MAX];
	bool m_PadArr[STATE_END][1000000];
	bool m_IsRunning = true;
};

