#pragma once
#include "SingletonBase.h"
#include "fmod.hpp"
#pragma comment(lib, "fmodex_vc.lib")
#pragma comment(lib, "fmodex64_vc.lib")

using namespace FMOD;

#define EXTRACHANNELBUFFER 5
#define SOUNDBUFFER 20

#define TOTALSOUNDBUFFER SOUNDBUFFER + EXTRACHANNELBUFFER

class SoundManager : public SingletonBase<SoundManager>
{
public:
	SoundManager();
	~SoundManager();

public:
	void Initialize();
	void LoadSoundFile();
	void PlaySound(TCHAR* SoundKey, CHANNEL id, bool bLoop = false);
	void PlayBGM(TCHAR* SoundKey, CHANNEL id);
	void SetVolume(CHANNEL id, float fVolume);
	void UpdateSound();
	void StopSound(CHANNEL id);
	void StopAll();
	void Release();

private:
	FMOD_SYSTEM* m_System;
	FMOD_CHANNEL* m_ChannelArr[CH_END]; // 채널은 중첩되지 않게 준비.

	map<const TCHAR*, FMOD_SOUND*>	m_mapSound;
};

