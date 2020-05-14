#pragma once
#include "Timer.h"
#include "CScene.h"
#include "CPlayer.h"
#include "CCamera.h"
#include "CBlur.h"
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

	void SetBulrSwitch(bool blurOn) { m_BlurSwitch = blurOn; }
	float GetBlurControl() { return m_fBlurControl; }
	float GetBlurAmount() { return m_fBlurAmount; }

	ID3D12Resource *CurrentBackBuffer()const;
	D3D12_CPU_DESCRIPTOR_HANDLE CurrentBackBufferView()const;
	

	void BuildScene();
	void OnProcessingMouseMessage(HWND hWnd, UINT nMessageID, WPARAM wParam, LPARAM lParam);
	void OnProcessingKeyboardMessage(HWND hWnd, UINT nMessageID, WPARAM wParam, LPARAM lParam);
	LRESULT CALLBACK OnProcessingWindowMessage(HWND hWnd, UINT nMessageID, WPARAM wParam, LPARAM lParam);
	void ProcessInput();
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

	int m_nCurrBackBuffer = 0;

	ID3D12RootSignature* m_pRootSignature = NULL;

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
	CBlur* m_pBlur = NULL;
	CBlurFilter* m_pBlurFilter = NULL;
	CCamera* m_pCamera = NULL;

	unsigned int numerator, denominator, FrameRate;
	size_t stringLength;

	char m_videoCardDescription[128];

	int m_BlurSwitch = 0;
	float m_fBlurAmount = 0.f;
	float m_fBlurControl = 0.f;

	int m_SceneSwitch = SCENE_TEST;
};

