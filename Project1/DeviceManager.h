#pragma once
#include "Timer.h"
#include "CScene.h"
#include "CPlayer.h"
#include "CCamera.h"
#include "SceneManager.h"

class CDeviceManager : public SingletonBase<CDeviceManager>
{
public:
	CDeviceManager();
	~CDeviceManager();

public:
	void DeviceInitalize(HINSTANCE hInstance, HWND hMainWnd);
	void CreateD3DDevice();
	void CreateCommandQueueAndList();
	void CreateRtvAndDsvDescriptorHeaps();
	void CreateSwapChain();
	void CreateRenderTargetViews();
	void CreateDepthStencilView();
	void ChangeSwapChainState();

	void BuildScene();
	void AnimateObjects();
	void FrameAdvance();

	void WaitForGpuComplete();
	void MoveToNextFrame();


private:
	HINSTANCE					m_hInstance;
	HWND						m_hWnd;

private:
	IDXGIFactory4* m_pdxgiFactory = NULL;
	IDXGISwapChain3* m_pdxgiSwapChain = NULL;
	ID3D12Device* m_pd3dDevice = NULL;

private:
	int							m_nWndClientWidth;
	int							m_nWndClientHeight;

	bool						m_bMsaa4xEnable = false;
	UINT						m_nMsaa4xQualityLevels = 0;

	static const UINT			m_nSwapChainBuffers = 2;
	UINT						m_nSwapChainBufferIndex;

	ID3D12Resource* m_ppd3dSwapChainBackBuffers[m_nSwapChainBuffers];
	ID3D12DescriptorHeap* m_pd3dRtvDescriptorHeap = NULL;
	UINT						m_nRtvDescriptorIncrementSize;

	ID3D12Resource* m_pd3dDepthStencilBuffer = NULL;
	ID3D12DescriptorHeap* m_pd3dDsvDescriptorHeap = NULL;
	UINT						m_nDsvDescriptorIncrementSize;

	ID3D12CommandAllocator* m_pd3dCommandAllocator = NULL;
	ID3D12CommandQueue* m_pd3dCommandQueue = NULL;
	ID3D12GraphicsCommandList* m_pd3dCommandList = NULL;

	ID3D12Fence* m_pd3dFence = NULL;
	UINT64						m_nFenceValues[m_nSwapChainBuffers];
	HANDLE						m_hFenceEvent;

	//#if defined(_DEBUG)
	//	ID3D12Debug					*m_pd3dDebugController;
	//#endif

	POINT						m_ptOldCursorPos;

	_TCHAR						m_pszFrameRate[70];

	SceneManager* m_pSceneManager;

	CGameTimer					m_GameTimer;
	//CScene* m_pScene = NULL;
	CPlayer* m_pPlayer = NULL;
	CCamera* m_pCamera = NULL;
};

