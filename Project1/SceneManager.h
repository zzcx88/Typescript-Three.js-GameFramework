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
	ID3D12RootSignature* GetComputeRootSignature() { return m_Scene->GetComputeRootSignature(); }
	ID3D12DescriptorHeap* GetCbvSrvDescriptorHeap() { return m_Scene->GetCbvSrvDescriptorHeap(); }

public:
	bool ChangeSceneState(SCENESTATE SceneState, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList);
	void SetPlayer(CPlayer* pPlayer) { m_Scene->m_pPlayer = pPlayer; }
public:
	int Update(const float& TimeDelta);
	void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera, ID3D12Resource* pCurrentBackBuffer);
	void Release();

private:
	CScene* m_Scene = nullptr;
	SCENESTATE m_CurrentScene = SCENE_END;
};

