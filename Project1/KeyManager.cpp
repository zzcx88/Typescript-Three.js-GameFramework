#include "stdafx.h"
#include "KeyManager.h"

KeyManager::KeyManager()
{
	ZeroMemory(&m_KeyArr, sizeof(KEY_MAX) * STATE_END);
}

KeyManager::~KeyManager()
{
}

const bool KeyManager::GetKeyState(const KEYSTATE& KeyState, const int& VirtualKey)
{
	if (VirtualKey >= KEY_MAX ||
		KeyState >= STATE_END)
	{
		return false;
	}

	return m_KeyArr[KeyState][VirtualKey];
}

int KeyManager::UpdateKey()
{
	if (false == m_IsRunning)
	{
		ZeroMemory(&m_KeyArr, sizeof(KEY_MAX) * STATE_END);
		return 0;
	}

	// Keyboard
	ComputeKeyState(VK_LEFT);
	ComputeKeyState(VK_RIGHT);
	ComputeKeyState(VK_UP);
	ComputeKeyState(VK_DOWN);
	ComputeKeyState(VK_SPACE);
	ComputeKeyState(VK_LCONTROL);
	ComputeKeyState(VK_LSHIFT);
	ComputeKeyState(VK_TAB);
	ComputeKeyState(VK_Q);
	ComputeKeyState(VK_E);
	ComputeKeyState(VK_W);
	ComputeKeyState(VK_S);
	ComputeKeyState(VK_G);
	ComputeKeyState(VK_F);
	ComputeKeyState(VK_F1);
	ComputeKeyState(VK_F2);
	ComputeKeyState(VK_BACK);
	ComputeKeyState(VK_RETURN);

	// Mouse
	ComputeKeyState(VK_LBUTTON);

	return 0;
}

void KeyManager::ComputeKeyState(const int& VirtualKey)
{
	bool& KeyStateDown = m_KeyArr[STATE_DOWN][VirtualKey];
	bool& KeyStatePush = m_KeyArr[STATE_PUSH][VirtualKey];
	bool& KeyStateUp = m_KeyArr[STATE_UP][VirtualKey];

	SHORT KeyState = GetAsyncKeyState(VirtualKey);

	if (0 != GetAsyncKeyState(VirtualKey))
	{
		// 이전에 누른적이 없는 상태에서 눌린경우
		if (false == KeyStateDown &&
			false == KeyStatePush)
		{
			KeyStateDown = true;
			KeyStatePush = false;
			KeyStateUp = false;
		}
		// 이전에 누른적이 있는 상태에서 눌린경우
		else
		{
			KeyStateDown = false;
			KeyStatePush = true;
			KeyStateUp = false;
		}
	}
	else
	{
		// 이전에 누른적이 없는 상태에서 뗀경우
		if (true == KeyStateUp)
		{
			KeyStateDown = false;
			KeyStatePush = false;
			KeyStateUp = false;
		}
		// 이전에 누른적이 있는 상태에서 뗀경우
		else //if(true == KeyStateDown || true == KeyStatePush)
		{
			KeyStateDown = false;
			KeyStatePush = false;
			KeyStateUp = true;
		}
	}
	//cout << (bool)KeyStateDown << " " << (bool)KeyStatePush << " " << (bool)KeyStateUp << endl;
}