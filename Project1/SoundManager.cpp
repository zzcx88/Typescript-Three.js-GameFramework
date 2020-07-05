#include "stdafx.h"
#include "SoundManager.h"

SoundManager::SoundManager()
{
	Initialize();
}

SoundManager::~SoundManager()
{
	Release();
}

void SoundManager::Initialize()
{
	UINT m_version = 0;
	// Fmod 생성 초기화
	FMOD_System_Create(&m_System);
	FMOD_System_GetVersion(m_System, &m_version);
	FMOD_System_Init(m_System, 32, FMOD_INIT_NORMAL, NULL);
	LoadSoundFile();
}

void SoundManager::LoadSoundFile()
{
	// 음악이 담긴 폴더 전체 이름을 컨테이너에 넣는다.
	vector<bstr_t> fileNames;
	GET_MANAGER<FileManager>()->GetFileListFromFolder("Sound/*.*", fileNames);

	char originPath[1024];
	memset(originPath, 0, sizeof(char) * 1024);

	strcpy_s(originPath, "Sound/");

	for (auto& file : fileNames)
	{
		char tmpPath[1024] = "";

		strcpy_s(tmpPath, "Sound/");
		strcat_s(tmpPath, (char*)file);
		FMOD_SOUND* Sound;
		FMOD_RESULT FRes = FMOD_System_CreateSound(m_System, tmpPath, FMOD_HARDWARE, NULL, &Sound);

		if (FMOD_OK == FRes)
		{
			TCHAR* SoundKey = new TCHAR[1024];
			ZeroMemory(SoundKey, sizeof(TCHAR) * 1024);

			MultiByteToWideChar(CP_ACP, 0, (char*)file, (int)strlen(file) + 1,
				SoundKey, 1024);

			m_mapSound.insert(make_pair(SoundKey, Sound));
			cout << (bstr_t)SoundKey << endl;
		}
	}

	FMOD_System_Update(m_System);
}

//볼륨조절
//FMOD_Channel_SetVolume
//FMOD_Channel_GetVolume

void SoundManager::PlaySound(TCHAR* SoundKey, CHANNEL id, bool bLoop)
{
	map<const TCHAR*, FMOD_SOUND*>::iterator iter = find_if(
		m_mapSound.begin(), m_mapSound.end(), [&](auto& p) {return 0 == wcscmp(p.first, SoundKey); });

	if (iter == m_mapSound.end())
		return;
	if (SoundKey == L"AfterBurner_Base.mp3" || SoundKey == L"AfterBurner_Boost.mp3" || SoundKey == L"GunFire.mp3")
	{
		FMOD_Sound_SetMode(iter->second, FMOD_LOOP_NORMAL);
	}
	if(bLoop == true)
		FMOD_Sound_SetMode(iter->second, FMOD_LOOP_NORMAL);
	FMOD_System_PlaySound(m_System, FMOD_CHANNEL_FREE, iter->second, 0, &(m_ChannelArr[id]));
}

void SoundManager::PlayBGM(TCHAR* SoundKey, CHANNEL id)
{
	map<const TCHAR*, FMOD_SOUND*>::iterator iter = find_if(
		m_mapSound.begin(), m_mapSound.end(), [&](auto& p) {return 0 == wcscmp(p.first, SoundKey); });

	if (iter == m_mapSound.end())
		return;

	FMOD_Sound_SetMode(iter->second, FMOD_LOOP_NORMAL);
	FMOD_System_PlaySound(m_System, FMOD_CHANNEL_REUSE, iter->second, 0, &(m_ChannelArr[id]));
}

void SoundManager::SetVolume(CHANNEL id, float fVolume)
{
	FMOD_Channel_SetVolume(m_ChannelArr[id], fVolume);
}

void SoundManager::UpdateSound()
{
	FMOD_System_Update(m_System);
}

void SoundManager::StopSound(CHANNEL id)
{
	FMOD_Channel_Stop(m_ChannelArr[id]);
}

void SoundManager::StopAll()
{
	for (int i = 0; i < CH_END; ++i)
		FMOD_Channel_Stop(m_ChannelArr[i]);
}

void SoundManager::Release()
{
	for (auto& iter : m_mapSound)
	{
		delete[] iter.first;
		FMOD_Sound_Release(iter.second);
	}

	m_mapSound.clear();

	FMOD_System_Close(m_System);
	FMOD_System_Release(m_System);
}
