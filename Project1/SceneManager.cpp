#include "stdafx.h"
#include "SceneManager.h"
#include "CTestScene.h"

SceneManager::SceneManager()
{
}


SceneManager::~SceneManager()
{
	Release();
}

bool SceneManager::ChangeSceneState(SCENESTATE SceneState, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList)
{
	if (nullptr != m_Scene)
	{
		Release();
	}
	if (m_Scene) m_Scene->ReleaseUploadBuffers();
	GET_MANAGER<ObjectManager>()->ReleaseAll();

	switch (SceneState)
	{
	case SCENE_TEST:
		m_Scene = new CTestScene;
		break;
	}

	if (nullptr == m_Scene)
		return false;
	SetSceneObjManager();
	m_Scene->BuildObjects(pd3dDevice, pd3dCommandList);

	m_CurrentScene = SceneState;

	return true;
}

void SceneManager::SetSceneObjManager()
{
	m_Scene->m_ObjManager = GET_MANAGER<ObjectManager>();
}

void SceneManager::SetObjManagerInPlayer()
{
	m_Scene->m_pPlayer->m_ObjManager = GET_MANAGER<ObjectManager>();
	GET_MANAGER<ObjectManager>()->AddObject(L"player", m_Scene->m_pPlayer, OBJ_PLAYER);
}

int SceneManager::Update(const float& TimeDelta)
{
	m_Scene->AnimateObjects(TimeDelta);
	return 0;
}

void SceneManager::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	m_Scene->Render(pd3dCommandList, pCamera);
}

void SceneManager::ReleaseUploadBuffers()
{
	m_Scene->ReleaseUploadBuffers();
}

void SceneManager::Release()
{
	if (m_Scene)
	{
		delete m_Scene;
		m_Scene = nullptr;
	}
}