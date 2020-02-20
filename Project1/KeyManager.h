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
	// 2차원 배열로 열이 키 상태 행렬이 키의 배열이 
	bool m_KeyArr[STATE_END][KEY_MAX];
	bool m_IsRunning = true;
};

