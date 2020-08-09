#include "stdafx.h"
#include "KeyManager.h"

KeyManager::KeyManager()
{
	ZeroMemory(&m_KeyArr, sizeof(KEY_MAX) * STATE_END);
	m_pPadConnecter = new CXBOXController(1);
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

const bool KeyManager::GetPadState(const KEYSTATE& KeyState, const WORD& VirtualKey)
{
	if (KeyState >= STATE_END)
	{
		return false;
	}

	return m_PadArr[KeyState][VirtualKey];
}

int KeyManager::UpdateKey()
{
	if (false == m_IsRunning)
	{
		ZeroMemory(&m_KeyArr, sizeof(KEY_MAX) * STATE_END);
		return 0;
	}
	//GamePad
	if (m_pPadConnecter->IsConnected() == true)
	{
		ComputePadState(XINPUT_GAMEPAD_A);
		ComputePadState(XINPUT_GAMEPAD_B);
		ComputePadState(XINPUT_GAMEPAD_X);
		ComputePadState(XINPUT_GAMEPAD_Y);
		ComputePadState(XINPUT_GAMEPAD_START);
		ComputePadState(XINPUT_GAMEPAD_BACK);
		ComputePadState(XINPUT_GAMEPAD_LEFT_SHOULDER);
		ComputePadState(XINPUT_GAMEPAD_RIGHT_SHOULDER);
		ComputePadState(XINPUT_GAMEPAD_DPAD_DOWN);
		ComputePadState(XINPUT_GAMEPAD_DPAD_UP);
		ComputePadState(XINPUT_GAMEPAD_RIGHT_THUMB);
		ComputePadState(XINPUT_GAMEPAD_LEFT_THUMB);
		ComputePadLStickState();
		ComputeKeyState(VK_CAPITAL);
		ComputeKeyState(VK_TAB);
	}
	else
	{
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
		ComputeKeyState(VK_T);
		ComputeKeyState(VK_F);
		ComputeKeyState(VK_F1);
		ComputeKeyState(VK_F2);
		ComputeKeyState(VK_BACK);
		ComputeKeyState(VK_RETURN);
		ComputeKeyState(VK_CAPITAL);

		// Mouse
		ComputeKeyState(VK_LBUTTON);
	}
	return 0;
}

void KeyManager::ComputeKeyState(const int& VirtualKey)
{
	bool& KeyStateDown = m_KeyArr[STATE_DOWN][VirtualKey];
	bool& KeyStatePush = m_KeyArr[STATE_PUSH][VirtualKey];
	bool& KeyStateUp = m_KeyArr[STATE_UP][VirtualKey];

	//SHORT KeyState = GetAsyncKeyState(VirtualKey);

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

void KeyManager::ComputePadState(const WORD& VirtualKey)
{
	bool& KeyStateDown = m_PadArr[STATE_DOWN][VirtualKey];
	bool& KeyStatePush = m_PadArr[STATE_PUSH][VirtualKey];
	bool& KeyStateUp = m_PadArr[STATE_UP][VirtualKey];

	//SHORT KeyState = GetAsyncKeyState(VirtualKey);

	if ((m_pPadConnecter->GetState().Gamepad.wButtons & VirtualKey) != 0) 
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

float KeyManager::ComputePadLeftTrigerState()
{
	return (float)m_pPadConnecter->GetState().Gamepad.bLeftTrigger / 255.0f;
}

float KeyManager::ComputePadRightTrigerState()
{
	return (float)m_pPadConnecter->GetState().Gamepad.bRightTrigger / 255.0f;
}

float KeyManager::ComputePadLStickState()
{

	float LX = m_pPadConnecter->GetState().Gamepad.sThumbLX;
	float LY = m_pPadConnecter->GetState().Gamepad.sThumbLY;

	float magnitude = sqrt(LX * LX + LY * LY);

	normalizedLX = LX / magnitude;
	normalizedLY = LY / magnitude;

	float normalizedMagnitude = 0;
	if (magnitude > INPUT_DEADZONE)
	{
		if (magnitude > 32767) magnitude = 32767;
		magnitude -= INPUT_DEADZONE;
		normalizedMagnitude = magnitude / (32767 - INPUT_DEADZONE);
	}
	else
	{
		magnitude = 0.0;
		normalizedMagnitude = 0.0;
	}
	return normalizedMagnitude;
}



//bool KeyManager::isPressedPad(const WORD& VirtualButton)
//{
//	return (m_pPadConnecter->GetState().Gamepad.wButtons & VirtualButton) != 0;
//}
//
//bool KeyManager::wasPressedPad(const WORD& VirtualButton)
//{
//	return m_pwasPadConnecter->bWasPressed;
//}