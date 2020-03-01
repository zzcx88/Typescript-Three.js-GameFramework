#pragma once
#include "SingletonBase.h"
#include "CScene.h"
#include "CCamera.h"
#include "CPlayer.h"

class SceneManager : public SingletonBase<SceneManager>
{
public:
	SceneManager();
	virtual ~SceneManager();

public:
	SCENESTATE GetCurrentSceneState() { return m_CurrentScene; }
	ID3D12RootSignature* GetGraphicsRootSignature() { return m_Scene->GetGraphicsRootSignature(); }

public:
	bool ChangeSceneState(SCENESTATE SceneState, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList);
	void SetPlayer(CPlayer* pPlayer) { m_Scene->m_pPlayer = pPlayer; }
public:
	int Update(const float& TimeDelta);
	void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);
	void ReleaseUploadBuffers();
	void Release();

private:
	CScene* m_Scene = nullptr;
	SCENESTATE m_CurrentScene = SCENE_END;
};

