#include "stdafx.h"
#include "DeviceManager.h"
#include "CShaderManager.h"
#include "CPlayer.h"

CDeviceManager::CDeviceManager()
{
	m_pSceneManager = GET_MANAGER<SceneManager>();
	m_pdxgiFactory = NULL;
	m_pdxgiSwapChain = NULL;
	m_pd3dDevice = NULL;

	for (int i = 0; i < m_nSwapChainBuffers; i++) m_ppd3dSwapChainBackBuffers[i] = NULL;
	m_nSwapChainBufferIndex = 0;

	m_pd3dCommandAllocator = NULL;
	m_pd3dCommandQueue = NULL;
	m_pd3dCommandList = NULL;

	m_pd3dRtvDescriptorHeap = NULL;
	m_pd3dDsvDescriptorHeap = NULL;

	m_nRtvDescriptorIncrementSize = 0;
	m_nDsvDescriptorIncrementSize = 0;

	m_hFenceEvent = NULL;
	m_pd3dFence = NULL;
	for (int i = 0; i < m_nSwapChainBuffers; i++) m_nFenceValues[i] = 0;

	m_nWndClientWidth = FRAME_BUFFER_WIDTH;
	m_nWndClientHeight = FRAME_BUFFER_HEIGHT;

	_tcscpy_s(m_pszFrameRate, _T("SkiesOfAces"));
}

CDeviceManager::~CDeviceManager()
{
}

void CDeviceManager::DeviceInitalize(HINSTANCE hInstance, HWND hMainWnd)
{
	m_hInstance = hInstance;
	m_hWnd = hMainWnd;

	CreateD3DDevice();

	CreateCommandQueueAndList();
	CreateRtvAndDsvDescriptorHeaps();
	CreateSwapChain();
	CreateDepthStencilView();

	CoInitialize(NULL);

	BuildScene();

}

void CDeviceManager::CreateD3DDevice()
{
	HRESULT hResult;

	UINT nDXGIFactoryFlags = 0;

	//DXGIFactory 생성
	hResult = ::CreateDXGIFactory2(nDXGIFactoryFlags, __uuidof(IDXGIFactory4), (void**)&m_pdxgiFactory);

	IDXGIAdapter1* pd3dAdapter = NULL;

	//////////////////
	HRESULT hResult2;
	IDXGIAdapter* adapter;
	hResult2 = m_pdxgiFactory->EnumAdapters(0, &adapter);
	IDXGIOutput* adapterOutput;
	hResult2 = adapter->EnumOutputs(0, &adapterOutput);
	unsigned int numModes;
	hResult2 = adapterOutput->GetDisplayModeList(DXGI_FORMAT_R8G8B8A8_UNORM, DXGI_ENUM_MODES_INTERLACED, &numModes, NULL);
	DXGI_MODE_DESC* displayModeList;
	displayModeList = new DXGI_MODE_DESC[numModes];
	hResult2 = adapterOutput->GetDisplayModeList(DXGI_FORMAT_R8G8B8A8_UNORM, DXGI_ENUM_MODES_INTERLACED, &numModes, displayModeList);

	for (int i = 0; i < numModes; i++) 
	{ 
		if (displayModeList[i].Width == (unsigned int)FRAME_BUFFER_WIDTH)
		{
			if (displayModeList[i].Height == (unsigned int)FRAME_BUFFER_HEIGHT)
			{ 
				numerator = displayModeList[i].RefreshRate.Numerator; 
				denominator = displayModeList[i].RefreshRate.Denominator; 
				FrameRate = numerator / denominator;
			} 
		} 
	}

	DXGI_ADAPTER_DESC adapterDesc;
	adapter->GetDesc(&adapterDesc);
	wcstombs_s(&stringLength, m_videoCardDescription, 128, adapterDesc.Description, 128);
	cout << m_videoCardDescription << endl;



	for (UINT i = 0; DXGI_ERROR_NOT_FOUND != m_pdxgiFactory->EnumAdapters1(i, &pd3dAdapter); i++)
	{
		DXGI_ADAPTER_DESC1 dxgiAdapterDesc;
		pd3dAdapter->GetDesc1(&dxgiAdapterDesc);
		if (dxgiAdapterDesc.Flags & DXGI_ADAPTER_FLAG_SOFTWARE) continue;
		if (SUCCEEDED(D3D12CreateDevice(pd3dAdapter, D3D_FEATURE_LEVEL_12_1, _uuidof(ID3D12Device), (void**)&m_pd3dDevice))) break;
	}

	if (!pd3dAdapter)
	{
		hResult = m_pdxgiFactory->EnumWarpAdapter(_uuidof(IDXGIAdapter1), (void**)&pd3dAdapter);
		hResult = D3D12CreateDevice(pd3dAdapter, D3D_FEATURE_LEVEL_12_1, _uuidof(ID3D12Device), (void**)&m_pd3dDevice);
	}
	D3D12_FEATURE_DATA_MULTISAMPLE_QUALITY_LEVELS d3dMsaaQualityLevels;
	d3dMsaaQualityLevels.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
	d3dMsaaQualityLevels.SampleCount = 4;
	d3dMsaaQualityLevels.Flags = D3D12_MULTISAMPLE_QUALITY_LEVELS_FLAG_NONE;
	d3dMsaaQualityLevels.NumQualityLevels = 4;
	hResult = m_pd3dDevice->CheckFeatureSupport(D3D12_FEATURE_MULTISAMPLE_QUALITY_LEVELS, &d3dMsaaQualityLevels, sizeof(D3D12_FEATURE_DATA_MULTISAMPLE_QUALITY_LEVELS));
	m_nMsaa4xQualityLevels = d3dMsaaQualityLevels.NumQualityLevels;
	m_bMsaa4xEnable = (m_nMsaa4xQualityLevels > 1) ? true : false;

	hResult = m_pd3dDevice->CreateFence(0, D3D12_FENCE_FLAG_NONE, __uuidof(ID3D12Fence), (void**)&m_pd3dFence);
	for (UINT i = 0; i < m_nSwapChainBuffers; i++) m_nFenceValues[i] = 0;

	m_hFenceEvent = ::CreateEvent(NULL, FALSE, FALSE, NULL);

	if (pd3dAdapter) pd3dAdapter->Release();
}

void CDeviceManager::CreateCommandQueueAndList()
{
	HRESULT hResult;

	D3D12_COMMAND_QUEUE_DESC d3dCommandQueueDesc;
	::ZeroMemory(&d3dCommandQueueDesc, sizeof(D3D12_COMMAND_QUEUE_DESC));
	d3dCommandQueueDesc.Flags = D3D12_COMMAND_QUEUE_FLAG_NONE;
	d3dCommandQueueDesc.Type = D3D12_COMMAND_LIST_TYPE_DIRECT;
	hResult = m_pd3dDevice->CreateCommandQueue(&d3dCommandQueueDesc, _uuidof(ID3D12CommandQueue), (void**)&m_pd3dCommandQueue);

	hResult = m_pd3dDevice->CreateCommandAllocator(D3D12_COMMAND_LIST_TYPE_DIRECT, __uuidof(ID3D12CommandAllocator), (void**)&m_pd3dCommandAllocator);

	hResult = m_pd3dDevice->CreateCommandList(0, D3D12_COMMAND_LIST_TYPE_DIRECT, m_pd3dCommandAllocator, NULL, __uuidof(ID3D12GraphicsCommandList), (void**)&m_pd3dCommandList);
	hResult = m_pd3dCommandList->Close();
}

void CDeviceManager::CreateRtvAndDsvDescriptorHeaps()
{
	D3D12_DESCRIPTOR_HEAP_DESC d3dDescriptorHeapDesc;
	::ZeroMemory(&d3dDescriptorHeapDesc, sizeof(D3D12_DESCRIPTOR_HEAP_DESC));
	d3dDescriptorHeapDesc.NumDescriptors = m_nSwapChainBuffers;
	d3dDescriptorHeapDesc.Type = D3D12_DESCRIPTOR_HEAP_TYPE_RTV;
	d3dDescriptorHeapDesc.Flags = D3D12_DESCRIPTOR_HEAP_FLAG_NONE;
	d3dDescriptorHeapDesc.NodeMask = 0;
	HRESULT hResult = m_pd3dDevice->CreateDescriptorHeap(&d3dDescriptorHeapDesc, __uuidof(ID3D12DescriptorHeap), (void**)&m_pd3dRtvDescriptorHeap);
	m_nRtvDescriptorIncrementSize = m_pd3dDevice->GetDescriptorHandleIncrementSize(D3D12_DESCRIPTOR_HEAP_TYPE_RTV);

	d3dDescriptorHeapDesc.NumDescriptors = 1;
	d3dDescriptorHeapDesc.Type = D3D12_DESCRIPTOR_HEAP_TYPE_DSV;
	hResult = m_pd3dDevice->CreateDescriptorHeap(&d3dDescriptorHeapDesc, __uuidof(ID3D12DescriptorHeap), (void**)&m_pd3dDsvDescriptorHeap);
	m_nDsvDescriptorIncrementSize = m_pd3dDevice->GetDescriptorHandleIncrementSize(D3D12_DESCRIPTOR_HEAP_TYPE_DSV);
}

void CDeviceManager::CreateSwapChain()
{
	RECT rcClient;
	::GetClientRect(m_hWnd, &rcClient);
	m_nWndClientWidth = rcClient.right - rcClient.left;
	m_nWndClientHeight = rcClient.bottom - rcClient.top;
//#define _WITH_CREATE_SWAPCHAIN_FOR_HWND
#ifdef _WITH_CREATE_SWAPCHAIN_FOR_HWND
	DXGI_SWAP_CHAIN_DESC1 dxgiSwapChainDesc;
	::ZeroMemory(&dxgiSwapChainDesc, sizeof(DXGI_SWAP_CHAIN_DESC1));
	dxgiSwapChainDesc.Width = m_nWndClientWidth;
	dxgiSwapChainDesc.Height = m_nWndClientHeight;
	dxgiSwapChainDesc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
	dxgiSwapChainDesc.SampleDesc.Count = (m_bMsaa4xEnable) ? 4 : 1;
	dxgiSwapChainDesc.SampleDesc.Quality = (m_bMsaa4xEnable) ? (m_nMsaa4xQualityLevels - 1) : 0;
	dxgiSwapChainDesc.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;
	dxgiSwapChainDesc.BufferCount = m_nSwapChainBuffers;
	dxgiSwapChainDesc.Scaling = DXGI_SCALING_NONE;
	dxgiSwapChainDesc.SwapEffect = DXGI_SWAP_EFFECT_FLIP_DISCARD;
	dxgiSwapChainDesc.AlphaMode = DXGI_ALPHA_MODE_UNSPECIFIED;
	dxgiSwapChainDesc.Flags = DXGI_SWAP_CHAIN_FLAG_ALLOW_MODE_SWITCH;

	DXGI_SWAP_CHAIN_FULLSCREEN_DESC dxgiSwapChainFullScreenDesc;
	::ZeroMemory(&dxgiSwapChainFullScreenDesc, sizeof(DXGI_SWAP_CHAIN_FULLSCREEN_DESC));
	dxgiSwapChainFullScreenDesc.RefreshRate.Numerator = 60;
	dxgiSwapChainFullScreenDesc.RefreshRate.Denominator = 1;
	dxgiSwapChainFullScreenDesc.ScanlineOrdering = DXGI_MODE_SCANLINE_ORDER_UNSPECIFIED;
	dxgiSwapChainFullScreenDesc.Scaling = DXGI_MODE_SCALING_UNSPECIFIED;
	dxgiSwapChainFullScreenDesc.Windowed = TRUE;

	HRESULT hResult = m_pdxgiFactory->CreateSwapChainForHwnd(m_pd3dCommandQueue, m_hWnd, &dxgiSwapChainDesc, &dxgiSwapChainFullScreenDesc, NULL, (IDXGISwapChain1**)&m_pdxgiSwapChain);
#else
	DXGI_SWAP_CHAIN_DESC dxgiSwapChainDesc;
	::ZeroMemory(&dxgiSwapChainDesc, sizeof(dxgiSwapChainDesc));
	dxgiSwapChainDesc.BufferCount = m_nSwapChainBuffers;
	dxgiSwapChainDesc.BufferDesc.Width = m_nWndClientWidth;
	dxgiSwapChainDesc.BufferDesc.Height = m_nWndClientHeight;
	dxgiSwapChainDesc.BufferDesc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;

	dxgiSwapChainDesc.BufferDesc.RefreshRate.Numerator = numerator;
	dxgiSwapChainDesc.BufferDesc.RefreshRate.Denominator = denominator;

	dxgiSwapChainDesc.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;
	dxgiSwapChainDesc.SwapEffect = DXGI_SWAP_EFFECT_FLIP_DISCARD;
	dxgiSwapChainDesc.OutputWindow = m_hWnd;
	dxgiSwapChainDesc.SampleDesc.Count = (m_bMsaa4xEnable) ? 4 : 1;
	dxgiSwapChainDesc.SampleDesc.Quality = (m_bMsaa4xEnable) ? (m_nMsaa4xQualityLevels - 1) : 0;
	dxgiSwapChainDesc.Windowed = TRUE;
	dxgiSwapChainDesc.Flags = DXGI_SWAP_CHAIN_FLAG_ALLOW_MODE_SWITCH;

	HRESULT hResult = m_pdxgiFactory->CreateSwapChain(m_pd3dCommandQueue, &dxgiSwapChainDesc, (IDXGISwapChain**)&m_pdxgiSwapChain);
#endif
	m_nSwapChainBufferIndex = m_pdxgiSwapChain->GetCurrentBackBufferIndex();

	hResult = m_pdxgiFactory->MakeWindowAssociation(m_hWnd, DXGI_MWA_NO_ALT_ENTER);

#ifndef _WITH_SWAPCHAIN_FULLSCREEN_STATE
	CreateRenderTargetViews(NULL, false);
#endif
}


void CDeviceManager::CreateRenderTargetViews(ID3D12Resource* pTexture , bool bRefractionTexture)
{
	D3D12_CPU_DESCRIPTOR_HANDLE d3dRtvCPUDescriptorHandle = m_pd3dRtvDescriptorHeap->GetCPUDescriptorHandleForHeapStart();
	for (UINT i = 0; i < m_nSwapChainBuffers; i++)
	{
		m_pdxgiSwapChain->GetBuffer(i, __uuidof(ID3D12Resource), (void**)&m_ppd3dSwapChainBackBuffers[i]);
		m_pd3dDevice->CreateRenderTargetView(m_ppd3dSwapChainBackBuffers[i], NULL, d3dRtvCPUDescriptorHandle);
		d3dRtvCPUDescriptorHandle.ptr += m_nRtvDescriptorIncrementSize;
	}
}

void CDeviceManager::CreateDepthStencilView()
{
	D3D12_RESOURCE_DESC d3dResourceDesc;
	d3dResourceDesc.Dimension = D3D12_RESOURCE_DIMENSION_TEXTURE2D;
	d3dResourceDesc.Alignment = 0;
	d3dResourceDesc.Width = m_nWndClientWidth;
	d3dResourceDesc.Height = m_nWndClientHeight;
	d3dResourceDesc.DepthOrArraySize = 1;
	d3dResourceDesc.MipLevels = 1;
	d3dResourceDesc.Format = DXGI_FORMAT_D24_UNORM_S8_UINT;
	d3dResourceDesc.SampleDesc.Count = (m_bMsaa4xEnable) ? 4 : 1;
	d3dResourceDesc.SampleDesc.Quality = (m_bMsaa4xEnable) ? (m_nMsaa4xQualityLevels - 1) : 0;
	d3dResourceDesc.Layout = D3D12_TEXTURE_LAYOUT_UNKNOWN;
	d3dResourceDesc.Flags = D3D12_RESOURCE_FLAG_ALLOW_DEPTH_STENCIL;

	D3D12_HEAP_PROPERTIES d3dHeapProperties;
	::ZeroMemory(&d3dHeapProperties, sizeof(D3D12_HEAP_PROPERTIES));
	d3dHeapProperties.Type = D3D12_HEAP_TYPE_DEFAULT;
	d3dHeapProperties.CPUPageProperty = D3D12_CPU_PAGE_PROPERTY_UNKNOWN;
	d3dHeapProperties.MemoryPoolPreference = D3D12_MEMORY_POOL_UNKNOWN;
	d3dHeapProperties.CreationNodeMask = 1;
	d3dHeapProperties.VisibleNodeMask = 1;

	D3D12_CLEAR_VALUE d3dClearValue;
	d3dClearValue.Format = DXGI_FORMAT_D24_UNORM_S8_UINT;
	d3dClearValue.DepthStencil.Depth = 1.0f;
	d3dClearValue.DepthStencil.Stencil = 0;

	m_pd3dDevice->CreateCommittedResource(&d3dHeapProperties, D3D12_HEAP_FLAG_NONE, &d3dResourceDesc, D3D12_RESOURCE_STATE_DEPTH_WRITE, &d3dClearValue, __uuidof(ID3D12Resource), (void**)&m_pd3dDepthStencilBuffer);

	D3D12_DEPTH_STENCIL_VIEW_DESC d3dDepthStencilViewDesc;
	::ZeroMemory(&d3dDepthStencilViewDesc, sizeof(D3D12_DEPTH_STENCIL_VIEW_DESC));
	d3dDepthStencilViewDesc.Format = DXGI_FORMAT_D24_UNORM_S8_UINT;
	d3dDepthStencilViewDesc.ViewDimension = D3D12_DSV_DIMENSION_TEXTURE2D;
	d3dDepthStencilViewDesc.Flags = D3D12_DSV_FLAG_NONE;

	D3D12_CPU_DESCRIPTOR_HANDLE d3dDsvCPUDescriptorHandle = m_pd3dDsvDescriptorHeap->GetCPUDescriptorHandleForHeapStart();
	m_pd3dDevice->CreateDepthStencilView(m_pd3dDepthStencilBuffer, &d3dDepthStencilViewDesc, d3dDsvCPUDescriptorHandle);
}

void CDeviceManager::ChangeSwapChainState()
{
	WaitForGpuComplete();

	BOOL bFullScreenState = FALSE;
	m_pdxgiSwapChain->GetFullscreenState(&bFullScreenState, NULL);
	m_pdxgiSwapChain->SetFullscreenState(!bFullScreenState, NULL);


	HRESULT hResult2;
	IDXGIAdapter* adapter;
	hResult2 = m_pdxgiFactory->EnumAdapters(0, &adapter);
	IDXGIOutput* adapterOutput;
	hResult2 = adapter->EnumOutputs(0, &adapterOutput);
	unsigned int numModes;
	hResult2 = adapterOutput->GetDisplayModeList(DXGI_FORMAT_R8G8B8A8_UNORM, DXGI_ENUM_MODES_INTERLACED, &numModes, NULL);
	DXGI_MODE_DESC* displayModeList;
	displayModeList = new DXGI_MODE_DESC[numModes];
	hResult2 = adapterOutput->GetDisplayModeList(DXGI_FORMAT_R8G8B8A8_UNORM, DXGI_ENUM_MODES_INTERLACED, &numModes, displayModeList);

	for (int i = 0; i < numModes; i++)
	{
		if (displayModeList[i].Width == (unsigned int)GetSystemMetrics(SM_CXSCREEN))
		{
			if (displayModeList[i].Height == (unsigned int)GetSystemMetrics(SM_CYSCREEN))
			{
				numerator = displayModeList[i].RefreshRate.Numerator;
				denominator = displayModeList[i].RefreshRate.Denominator;
				FrameRate = numerator / denominator;
			}
		}
	}


	DXGI_MODE_DESC dxgiTargetParameters;
	dxgiTargetParameters.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
	dxgiTargetParameters.Width = m_nWndClientWidth;
	dxgiTargetParameters.Height = m_nWndClientHeight;
	dxgiTargetParameters.RefreshRate.Numerator = numerator;
	dxgiTargetParameters.RefreshRate.Denominator = denominator;
	dxgiTargetParameters.Scaling = DXGI_MODE_SCALING_UNSPECIFIED;
	dxgiTargetParameters.ScanlineOrdering = DXGI_MODE_SCANLINE_ORDER_UNSPECIFIED;
	m_pdxgiSwapChain->ResizeTarget(&dxgiTargetParameters);

	for (int i = 0; i < m_nSwapChainBuffers; i++) if (m_ppd3dSwapChainBackBuffers[i]) m_ppd3dSwapChainBackBuffers[i]->Release();

	DXGI_SWAP_CHAIN_DESC dxgiSwapChainDesc;
	m_pdxgiSwapChain->GetDesc(&dxgiSwapChainDesc);
	m_pdxgiSwapChain->ResizeBuffers(m_nSwapChainBuffers, m_nWndClientWidth, m_nWndClientHeight, dxgiSwapChainDesc.BufferDesc.Format, dxgiSwapChainDesc.Flags);

	m_nSwapChainBufferIndex = m_pdxgiSwapChain->GetCurrentBackBufferIndex();

	CreateRenderTargetViews(NULL, false);
}

void CDeviceManager::BuildScene()
{
	m_pd3dCommandList->Reset(m_pd3dCommandAllocator, NULL);

	m_pSceneManager->ChangeSceneState(SCENE_MENU, m_pd3dDevice, m_pd3dCommandList);
	CTerrainPlayer* pPlayer = new CTerrainPlayer(m_pd3dDevice, m_pd3dCommandList, m_pSceneManager->GetGraphicsRootSignature(), NULL);
	pPlayer->SetGameOver(true);
	m_pPlayer = pPlayer;

	m_pCamera = m_pPlayer->GetCamera();


	m_pBlur = new CBlur(m_pd3dDevice, m_pd3dCommandList, m_pSceneManager->GetComputeRootSignature());
	
	m_pBlurFilter = new CBlurFilter(m_pd3dDevice, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT, DXGI_FORMAT_R8G8B8A8_UNORM);

	m_pBlurFilter->BuildDescriptors(
		CD3DX12_CPU_DESCRIPTOR_HANDLE(m_pSceneManager->GetCbvSrvDescriptorHeap()->GetCPUDescriptorHandleForHeapStart(), 11, 32),
		CD3DX12_GPU_DESCRIPTOR_HANDLE(m_pSceneManager->GetCbvSrvDescriptorHeap()->GetGPUDescriptorHandleForHeapStart(), 11, 32),
		32);

	m_pd3dCommandList->Close();
	ID3D12CommandList* ppd3dCommandLists[] = { m_pd3dCommandList };
	m_pd3dCommandQueue->ExecuteCommandLists(1, ppd3dCommandLists);

	WaitForGpuComplete();

	m_pSceneManager->SetPlayer(m_pPlayer);
	m_pSceneManager->SetObjManagerInPlayer();
	
	if (m_pPlayer) m_pPlayer->ReleaseUploadBuffers();
	if (m_pSceneManager) m_pSceneManager->ReleaseUploadBuffers();
	m_GameTimer.Reset();
}

void CDeviceManager::OnProcessingMouseMessage(HWND hWnd, UINT nMessageID, WPARAM wParam, LPARAM lParam)
{
	//if (m_pScene) m_pScene->OnProcessingMouseMessage(hWnd, nMessageID, wParam, lParam);
	switch (nMessageID)
	{
	case WM_LBUTTONDOWN:
	case WM_RBUTTONDOWN:
		::SetCapture(hWnd);
		::GetCursorPos(&m_ptOldCursorPos);
		break;
	case WM_LBUTTONUP:
	case WM_RBUTTONUP:
		::ReleaseCapture();
		break;
	case WM_MOUSEMOVE:
		break;
	default:
		break;
	}
}

void CDeviceManager::OnProcessingKeyboardMessage(HWND hWnd, UINT nMessageID, WPARAM wParam, LPARAM lParam)
{
	//if (m_pSceneManager) m_pSceneManager.->OnProcessingKeyboardMessage(hWnd, nMessageID, wParam, lParam);
	switch (nMessageID)
	{
	case WM_KEYUP:
		switch (wParam)
		{
		case VK_ESCAPE:
			::PostQuitMessage(0);
			break;
		case VK_RETURN:
			break;
		case VK_F1:
		case VK_F2:
			m_GameTimer.Stop();
			break;
		case VK_F3:
			m_pCamera = m_pPlayer->ChangeCamera((DWORD)(wParam - VK_F1 + 1), m_GameTimer.GetTimeElapsed());
			break;
		case VK_F4:
			if (m_BlurSwitch == BLUR_OFF) m_BlurSwitch = BLUR_ON;
			else m_BlurSwitch = BLUR_OFF;
			break;
		case VK_F5:
			break;
		case VK_F9:
			ChangeSwapChainState();
			break;
		default:
			break;
		}
		break;
	default:
		break;
	}
}

void CDeviceManager::SceneChangeInput(bool bCallByPlayer)
{
	KeyManager* keyManager = GET_MANAGER<KeyManager>();
	DWORD dwDirection = 0;
	if (m_pSceneManager->GetCurrentSceneState() == SCENE_TEST&&GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bGameOver != true)
	{
		if (true == keyManager->GetKeyState(STATE_PUSH, VK_G))
		{
			m_ArrowSwitch = 0;
			m_pUIarrow->SetPosition(m_pUI->GetPosition().x - 370, 48, 0);

			if (m_SceneSwitch == SCENE_TEST) {
				if (m_pSceneManager->GetSceneStoped() == false)
					m_BlurSwitch = BLUR_OFF;
				else
					m_BlurSwitch = BLUR_ON;

			}
		}
	}
	if (true == keyManager->GetKeyState(STATE_PUSH, VK_UP) || true == keyManager->GetPadState(STATE_PUSH, XINPUT_GAMEPAD_DPAD_UP))
	{
		if (m_SceneSwitch == SCENE_TEST) {
			if (m_pSceneManager->GetSceneStoped() == true)
			{
				m_ArrowSwitch = 0;
				m_pUIarrow->SetPosition(m_pUI->GetPosition().x -370, 48, 0);
			}
		}
	}
	if (true == keyManager->GetKeyState(STATE_PUSH, VK_DOWN) || true == keyManager->GetPadState(STATE_PUSH, XINPUT_GAMEPAD_DPAD_DOWN))
	{
		if (m_SceneSwitch == SCENE_TEST) {
			if (m_pSceneManager->GetSceneStoped() == true)
			{
				m_ArrowSwitch = 1;
				m_pUIarrow->SetPosition(m_pUI->GetPosition().x -370, 5, 0);
			}
		}
	}
	if (m_SceneSwitch == SCENE_TEST) {
		if (m_pSceneManager->GetSceneStoped() == true)
		{
			switch (m_ArrowSwitch)
			{
			case 0:
				if (true == keyManager->GetKeyState(STATE_PUSH, VK_RETURN) || true == keyManager->GetPadState(STATE_PUSH, XINPUT_GAMEPAD_A))
				{
					GET_MANAGER<SceneManager>()->SetStoped(false);
					for (auto i = (int)OBJ_MINIMAP_UI; i <= OBJ_UI; ++i)
					{
						if (i == OBJ_UI || i == OBJ_MINIMAP_UI)
						{
							for (auto p = GET_MANAGER<ObjectManager>()->GetObjFromType((OBJTYPE)i).begin(); p != GET_MANAGER<ObjectManager>()->GetObjFromType((OBJTYPE)i).end(); ++p)
							{
								(*p).second->SetIsRender(true);
							}
						}
					}
				}
				break;
			case 1:
				if (true == keyManager->GetKeyState(STATE_PUSH, VK_RETURN) || true == keyManager->GetPadState(STATE_PUSH, XINPUT_GAMEPAD_A))
				{
					m_pd3dCommandList->Reset(m_pd3dCommandAllocator, NULL);

					m_SceneSwitch = SCENE_MENU;
					m_pSceneManager->ChangeSceneState(SCENE_MENU, m_pd3dDevice, m_pd3dCommandList);
					CTerrainPlayer* pPlayer = new CTerrainPlayer(m_pd3dDevice, m_pd3dCommandList, m_pSceneManager->GetGraphicsRootSignature(), NULL);
					pPlayer->SetGameOver(true);
					m_pPlayer = pPlayer;

					m_pCamera = m_pPlayer->GetCamera();
					m_pd3dCommandList->Close();
					ID3D12CommandList* ppd3dCommandLists[] = { m_pd3dCommandList };
					m_pd3dCommandQueue->ExecuteCommandLists(1, ppd3dCommandLists);

					WaitForGpuComplete();
					m_pSceneManager->SetPlayer(m_pPlayer);
					m_pSceneManager->SetObjManagerInPlayer();

					if (m_pPlayer) m_pPlayer->ReleaseUploadBuffers();
					if (m_pSceneManager) m_pSceneManager->ReleaseUploadBuffers();
					m_GameTimer.Reset();
				}
				break;

			default:
				break;
			}
		
		}
	}
	
	if (true == keyManager->GetKeyState(STATE_PUSH, VK_BACK))
	{
		m_pd3dCommandList->Reset(m_pd3dCommandAllocator, NULL);
		m_SceneSwitch = SCENE_MENU;
		m_pSceneManager->ChangeSceneState(SCENE_MENU, m_pd3dDevice, m_pd3dCommandList);
		CTerrainPlayer* pPlayer = new CTerrainPlayer(m_pd3dDevice, m_pd3dCommandList, m_pSceneManager->GetGraphicsRootSignature(), NULL);
		pPlayer->SetGameOver(true);
		m_pPlayer = pPlayer;

		m_pCamera = m_pPlayer->GetCamera();
		m_pd3dCommandList->Close();
		ID3D12CommandList* ppd3dCommandLists[] = { m_pd3dCommandList };
		m_pd3dCommandQueue->ExecuteCommandLists(1, ppd3dCommandLists);

		WaitForGpuComplete();
		m_pSceneManager->SetPlayer(m_pPlayer);
		m_pSceneManager->SetObjManagerInPlayer();

		if (m_pPlayer) m_pPlayer->ReleaseUploadBuffers();
		if (m_pSceneManager) m_pSceneManager->ReleaseUploadBuffers();
		m_GameTimer.Reset();
	}

	if (true == keyManager->GetKeyState(STATE_PUSH, VK_SPACE) || true == keyManager->GetPadState(STATE_PUSH, XINPUT_GAMEPAD_START))
	{
		if (m_SceneSwitch == SCENE_MENU)
		{
			GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui1_title", OBJ_UI)->SetIsRender(false);
			GET_MANAGER<ObjectManager>()->GetObjFromTag(L"TitleAnimation", OBJ_EFFECT2)->SetIsRender(false);

			GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui2_1stage_loading", OBJ_EFFECT)->SetIsRender(true);
			m_bSceneFlag = true;
		}
	}
}

LRESULT CALLBACK CDeviceManager::OnProcessingWindowMessage(HWND hWnd, UINT nMessageID, WPARAM wParam, LPARAM lParam)
{
	switch (nMessageID)
	{
	case WM_ACTIVATE:
	{
		if (LOWORD(wParam) == WA_INACTIVE)
			m_GameTimer.Stop();
		else
			m_GameTimer.Start();
		break;
	}
	case WM_SIZE:
		break;
	case WM_LBUTTONDOWN:
	case WM_RBUTTONDOWN:
	case WM_LBUTTONUP:
	case WM_RBUTTONUP:
	case WM_MOUSEMOVE:
		OnProcessingMouseMessage(hWnd, nMessageID, wParam, lParam);
		break;
	case WM_KEYDOWN:
	case WM_KEYUP:
		OnProcessingKeyboardMessage(hWnd, nMessageID, wParam, lParam);
		break;
	}
	return(0);
}

void CDeviceManager::ProcessInput()
{
	static UCHAR pKeysBuffer[256];
	bool bProcessedByScene = false;
	GetKeyboardState(pKeysBuffer);
	if (!bProcessedByScene)
	{
		DWORD dwDirection = 0;
		if (pKeysBuffer[VK_UP] & 0xF0) 
			dwDirection |= DIR_FORWARD;
		if (pKeysBuffer[VK_DOWN] & 0xF0) dwDirection |= DIR_BACKWARD;
		if (pKeysBuffer[VK_LEFT] & 0xF0) dwDirection |= DIR_LEFT;
		if (pKeysBuffer[VK_RIGHT] & 0xF0) dwDirection |= DIR_RIGHT;
		if (pKeysBuffer[VK_PRIOR] & 0xF0) dwDirection |= DIR_UP;
		if (pKeysBuffer[VK_NEXT] & 0xF0) dwDirection |= DIR_DOWN;

		float cxDelta = 0.0f, cyDelta = 0.0f;
		POINT ptCursorPos;
		if (GetCapture() == m_hWnd)
		{
			SetCursor(NULL);
			GetCursorPos(&ptCursorPos);
			cxDelta = (float)(ptCursorPos.x - m_ptOldCursorPos.x) / 3.0f;
			cyDelta = (float)(ptCursorPos.y - m_ptOldCursorPos.y) / 3.0f;
			SetCursorPos(m_ptOldCursorPos.x, m_ptOldCursorPos.y);
		}

		if ((dwDirection != 0) || (cxDelta != 0.0f) || (cyDelta != 0.0f))
		{
			if (cxDelta || cyDelta)
			{
				if (pKeysBuffer[VK_RBUTTON] & 0xF0)
					m_pPlayer->Rotate(cyDelta, 0.0f, -cxDelta);
				else
					m_pPlayer->Rotate(cyDelta, cxDelta, 0.0f);
			}
			//if (dwDirection) m_pPlayer->Move(dwDirection, 12.25f, true);
		}
	}
	//m_pPlayer->Move(0x01, 3.0f, true);
	//m_pPlayer->Update(m_GameTimer.GetTimeElapsed());
}

void CDeviceManager::AnimateObjects()
{
	float fTimeElapsed = m_GameTimer.GetTimeElapsed();
	GET_MANAGER<SoundManager>()->UpdateSound();
	m_pSceneManager->Update(fTimeElapsed);
	GET_MANAGER<SoundManager>()->UpdateSound();
	//m_pPlayer->Update(m_GameTimer.GetTimeElapsed());
}

void CDeviceManager::FrameAdvance()
{
	m_GameTimer.Tick(FrameRate);

	//ProcessInput();

	AnimateObjects();
	m_pSceneManager->OnPreRender(m_pd3dDevice, m_pd3dCommandQueue, m_pd3dFence, m_hFenceEvent);

	HRESULT hResult = m_pd3dCommandAllocator->Reset();
	hResult = m_pd3dCommandList->Reset(m_pd3dCommandAllocator, NULL);

	D3D12_RESOURCE_BARRIER d3dResourceBarrier;
	::ZeroMemory(&d3dResourceBarrier, sizeof(D3D12_RESOURCE_BARRIER));
	d3dResourceBarrier.Type = D3D12_RESOURCE_BARRIER_TYPE_TRANSITION;
	d3dResourceBarrier.Flags = D3D12_RESOURCE_BARRIER_FLAG_NONE;
	d3dResourceBarrier.Transition.pResource = m_ppd3dSwapChainBackBuffers[m_nSwapChainBufferIndex];
	d3dResourceBarrier.Transition.StateBefore = D3D12_RESOURCE_STATE_PRESENT;
	d3dResourceBarrier.Transition.StateAfter = D3D12_RESOURCE_STATE_RENDER_TARGET;
	d3dResourceBarrier.Transition.Subresource = D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES;
	m_pd3dCommandList->ResourceBarrier(1, &d3dResourceBarrier);

	D3D12_CPU_DESCRIPTOR_HANDLE d3dRtvCPUDescriptorHandle = m_pd3dRtvDescriptorHeap->GetCPUDescriptorHandleForHeapStart();
	d3dRtvCPUDescriptorHandle.ptr += (m_nSwapChainBufferIndex * m_nRtvDescriptorIncrementSize);

	float pfClearColor[4] = { 0.525f, 0.75f, 1.f, 1.0f };
	m_pd3dCommandList->ClearRenderTargetView(d3dRtvCPUDescriptorHandle, pfClearColor/*Colors::Azure*/, 0, NULL);

	D3D12_CPU_DESCRIPTOR_HANDLE d3dDsvCPUDescriptorHandle = m_pd3dDsvDescriptorHeap->GetCPUDescriptorHandleForHeapStart();
	m_pd3dCommandList->ClearDepthStencilView(d3dDsvCPUDescriptorHandle, D3D12_CLEAR_FLAG_DEPTH | D3D12_CLEAR_FLAG_STENCIL, 1.0f, 0, 0, NULL);

	m_pd3dCommandList->OMSetRenderTargets(1, &d3dRtvCPUDescriptorHandle, TRUE, &d3dDsvCPUDescriptorHandle);

	m_pd3dCommandList->SetGraphicsRootSignature(m_pRootSignature);

	GET_MANAGER<SceneManager>()->OnPrepareRender(m_pd3dCommandList);
	m_pSceneManager->Render(m_pd3dCommandList, m_pCamera);

	//if (m_pPlayer) m_pPlayer->Render(m_pd3dCommandList, m_pCamera);
	//if(m_pPlayer->SphereCollider)m_pPlayer->SphereCollider->Render(m_pd3dCommandList, m_pCamera);


	if (m_BlurSwitch == BLUR_ON&&m_pSceneManager->GetSceneStoped()==false)
	{
		if (m_pPlayer->GetPitchWingsRotateDegree() != 0)
		{
			if (m_fBlurControl < 4.0f && m_pPlayer->GetAircraftSpeed() > 500)
				m_fBlurControl += m_GameTimer.GetTimeElapsed(); 
			else 
				if(m_fBlurControl > 0.0f)
					m_fBlurControl -= 4.0f * m_GameTimer.GetTimeElapsed();
		}
		else
		{
			if (m_fBlurControl > 0.f)
				m_fBlurControl -= 2.0f * m_GameTimer.GetTimeElapsed() ;
			else
				m_fBlurControl = 0.0f;
		}
		if (m_pPlayer->GetPitchWingsRotateDegree() > 0)
		{
			m_fBlurAmount = m_pPlayer->GetPitchWingsRotateDegree() * m_fBlurControl;
		}
		else
			m_fBlurAmount = m_pPlayer->GetPitchWingsRotateDegree() * -m_fBlurControl;
		if (m_pPlayer)
			m_pBlurFilter->Execute(m_pd3dCommandList, m_pSceneManager->GetComputeRootSignature(),
			m_pBlur->m_pHBlurPipelineState, m_pBlur->m_pVBlurPipelineState, CurrentBackBuffer(), m_fBlurAmount);

		// Prepare to copy blurred output to the back buffer. 후면 버퍼에 블러처리한 텍스쳐를 복사할 수 있도록 상태 전이
		d3dResourceBarrier.Transition.pResource = CurrentBackBuffer();
		d3dResourceBarrier.Transition.StateBefore = D3D12_RESOURCE_STATE_COPY_SOURCE;
		d3dResourceBarrier.Transition.StateAfter = D3D12_RESOURCE_STATE_COPY_DEST;
		d3dResourceBarrier.Transition.Subresource = D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES;
		m_pd3dCommandList->ResourceBarrier(1, &d3dResourceBarrier);

		m_pd3dCommandList->CopyResource(CurrentBackBuffer(), m_pBlurFilter->Output());

		// Transition to PRESENT state. 그리기 상태로 전이
		d3dResourceBarrier.Transition.pResource = CurrentBackBuffer();
		d3dResourceBarrier.Transition.StateBefore = D3D12_RESOURCE_STATE_COPY_DEST;
		d3dResourceBarrier.Transition.StateAfter = D3D12_RESOURCE_STATE_PRESENT;
		d3dResourceBarrier.Transition.Subresource = D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES;
		m_pd3dCommandList->ResourceBarrier(1, &d3dResourceBarrier);
	}
	else
	{
		m_fBlurAmount = 0;
		m_fBlurControl = 0;
		d3dResourceBarrier.Transition.StateBefore = D3D12_RESOURCE_STATE_RENDER_TARGET;
		d3dResourceBarrier.Transition.StateAfter = D3D12_RESOURCE_STATE_PRESENT;
		d3dResourceBarrier.Transition.Subresource = D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES;
		m_pd3dCommandList->ResourceBarrier(1, &d3dResourceBarrier);
	}

	if (m_BlurSwitch == BLUR_ON && m_pSceneManager->GetSceneStoped() == true)
	{
		if (m_pPlayer)
			m_pBlurFilter->Execute(m_pd3dCommandList, m_pSceneManager->GetComputeRootSignature(),
				m_pBlur->m_pHBlurPipelineState, m_pBlur->m_pVBlurPipelineState, CurrentBackBuffer(), 2.5);

		// Prepare to copy blurred output to the back buffer. 후면 버퍼에 블러처리한 텍스쳐를 복사할 수 있도록 상태 전이
		d3dResourceBarrier.Transition.pResource = CurrentBackBuffer();
		d3dResourceBarrier.Transition.StateBefore = D3D12_RESOURCE_STATE_COPY_SOURCE;
		d3dResourceBarrier.Transition.StateAfter = D3D12_RESOURCE_STATE_COPY_DEST;
		d3dResourceBarrier.Transition.Subresource = D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES;
		m_pd3dCommandList->ResourceBarrier(1, &d3dResourceBarrier);

		m_pd3dCommandList->CopyResource(CurrentBackBuffer(), m_pBlurFilter->Output());

		// Transition to PRESENT state. 그리기 상태로 전이
		d3dResourceBarrier.Transition.pResource = CurrentBackBuffer();
		d3dResourceBarrier.Transition.StateBefore = D3D12_RESOURCE_STATE_COPY_DEST;
		d3dResourceBarrier.Transition.StateAfter = D3D12_RESOURCE_STATE_PRESENT;
		d3dResourceBarrier.Transition.Subresource = D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES;
		m_pd3dCommandList->ResourceBarrier(1, &d3dResourceBarrier);
	}
	else if (m_BlurSwitch == BLUR_OFF && m_pSceneManager->GetSceneStoped() == false)
	{
		d3dResourceBarrier.Transition.StateBefore = D3D12_RESOURCE_STATE_RENDER_TARGET;
		d3dResourceBarrier.Transition.StateAfter = D3D12_RESOURCE_STATE_PRESENT;
		d3dResourceBarrier.Transition.Subresource = D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES;
		m_pd3dCommandList->ResourceBarrier(1, &d3dResourceBarrier);
	}

	if (m_SceneSwitch == SCENE_TEST&&m_pSceneManager->GetSceneStoped() == true&& GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bGameOver != true)
	{
		m_pUIarrow->SetIsRender(true);
		m_pUIarrow->Render(m_pd3dCommandList, m_pCamera);
		m_pUI->SetIsRender(true);
		m_pUI->Render(m_pd3dCommandList, m_pCamera);
	}
	else if(m_SceneSwitch == SCENE_TEST && m_pSceneManager->GetSceneStoped() == false)
	{
		m_pUIarrow->SetIsRender(false);
		m_pUI->SetIsRender(false);
	}

	hResult = m_pd3dCommandList->Close();

	ID3D12CommandList* ppd3dCommandLists[] = { m_pd3dCommandList };
	m_pd3dCommandQueue->ExecuteCommandLists(1, ppd3dCommandLists);

	WaitForGpuComplete();

	m_pdxgiSwapChain->Present(0, 0);

	m_xmf3prePosition = m_pPlayer->GetPosition();

	MoveToNextFrame();

	/*m_xmf3postPosition = m_pPlayer->GetPosition();

	m_xmf3TargetVector = Vector3::Subtract(m_xmf3postPosition, m_xmf3prePosition);
	m_xmf3TargetVector = Vector3::Normalize(m_xmf3TargetVector);*/

	m_GameTimer.GetFrameRate(m_pszFrameRate + 12, 37);
	size_t nLength = _tcslen(m_pszFrameRate);
	XMFLOAT3 xmf3Position = m_pPlayer->GetPosition();
	_stprintf_s(m_pszFrameRate + nLength, 70 - nLength, _T("(%4f, %4f, %4f)"), xmf3Position.x, xmf3Position.y, xmf3Position.z);
	::SetWindowText(m_hWnd, m_pszFrameRate);

	// 게임 오버시 시작화면으로
	if(m_SceneSwitch == SCENE_TEST && m_pSceneManager->GetSceneStoped() == true && GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bGameOver == true)
	{
		m_pUI->SetIsRender(true);

		/*m_pd3dCommandList->Reset(m_pd3dCommandAllocator, NULL);
		m_SceneSwitch = SCENE_MENU;
		m_pSceneManager->ChangeSceneState(SCENE_MENU, m_pd3dDevice, m_pd3dCommandList);
		CTerrainPlayer* pPlayer = new CTerrainPlayer(m_pd3dDevice, m_pd3dCommandList, m_pSceneManager->GetGraphicsRootSignature(), NULL);
		pPlayer->SetGameOver(true);
		m_pPlayer = pPlayer;

		m_pCamera = m_pPlayer->GetCamera();
		m_pd3dCommandList->Close();
		ID3D12CommandList* ppd3dCommandLists[] = { m_pd3dCommandList };
		m_pd3dCommandQueue->ExecuteCommandLists(1, ppd3dCommandLists);

		WaitForGpuComplete();
		m_pSceneManager->SetPlayer(m_pPlayer);
		m_pSceneManager->SetObjManagerInPlayer();

		if (m_pPlayer) m_pPlayer->ReleaseUploadBuffers();
		if (m_pSceneManager) m_pSceneManager->ReleaseUploadBuffers();
		m_GameTimer.Reset();*/
	}

	if (m_SceneSwitch == SCENE_MENU && m_bSceneFlag == true)
	{
		m_bSceneFlag = false;
		m_pd3dCommandList->Reset(m_pd3dCommandAllocator, NULL);

		m_SceneSwitch = SCENE_TEST;
		m_pSceneManager->ChangeSceneState(SCENE_TEST, m_pd3dDevice, m_pd3dCommandList);

		CMinimap* pUI = new CMinimap(1, m_pd3dDevice, m_pd3dCommandList, m_pSceneManager->GetGraphicsRootSignature(), 800.f, 400.f, 0.f, XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
		pUI->SetPosition(0.f, 0.f, 0.f);
		pUI->SetIsRender(false);
		m_pUI = pUI;

		CMinimap* pUIarrow = new CMinimap(5, m_pd3dDevice, m_pd3dCommandList, m_pSceneManager->GetGraphicsRootSignature(), 35.f, 35.f, 0.f, XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
		pUIarrow->SetPosition(m_pUI->GetPosition().x - 370, 48, 0);
		pUIarrow->SetIsRender(false);
		m_pUIarrow = pUIarrow;

		CAirplanePlayer* pPlayer = new CAirplanePlayer(m_pd3dDevice, m_pd3dCommandList, m_pSceneManager->GetGraphicsRootSignature(), NULL);
		pPlayer->SetGameOver(false);
		pPlayer->SetPosition(XMFLOAT3(0, 1000, 0));
		pPlayer->SetMissileCount(100);
		m_pPlayer = pPlayer;

		m_pCamera = m_pPlayer->GetCamera();

		m_pBlur = new CBlur(m_pd3dDevice, m_pd3dCommandList, m_pSceneManager->GetComputeRootSignature());

		m_pBlurFilter = new CBlurFilter(m_pd3dDevice, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT, DXGI_FORMAT_R8G8B8A8_UNORM);

		m_pBlurFilter->BuildDescriptors(
			CD3DX12_CPU_DESCRIPTOR_HANDLE(m_pSceneManager->GetCbvSrvDescriptorHeap()->GetCPUDescriptorHandleForHeapStart(), 11, 32),
			CD3DX12_GPU_DESCRIPTOR_HANDLE(m_pSceneManager->GetCbvSrvDescriptorHeap()->GetGPUDescriptorHandleForHeapStart(), 11, 32),
			32);

		m_pd3dCommandList->Close();
		ID3D12CommandList* ppd3dCommandLists[] = { m_pd3dCommandList };
		m_pd3dCommandQueue->ExecuteCommandLists(1, ppd3dCommandLists);

		WaitForGpuComplete();

		m_pSceneManager->SetPlayer(m_pPlayer);
		m_pSceneManager->SetObjManagerInPlayer();

		if (m_pUI) m_pUI->ReleaseUploadBuffers();
		if (m_pUIarrow) m_pUI->ReleaseUploadBuffers();

		if (m_pPlayer) m_pPlayer->ReleaseUploadBuffers();
		if (m_pSceneManager) m_pSceneManager->ReleaseUploadBuffers();
		m_GameTimer.Reset();
	}
	/*if (m_bStartGame == true)
	{
		m_bStartGame = false;
		ChangeSwapChainState();
	}*/
}

void CDeviceManager::WaitForGpuComplete()
{
	const UINT64 nFenceValue = ++m_nFenceValues[m_nSwapChainBufferIndex];
	HRESULT hResult = m_pd3dCommandQueue->Signal(m_pd3dFence, nFenceValue);

	if (m_pd3dFence->GetCompletedValue() < nFenceValue)
	{
		hResult = m_pd3dFence->SetEventOnCompletion(nFenceValue, m_hFenceEvent);
		::WaitForSingleObject(m_hFenceEvent, INFINITE);
	}
}

void CDeviceManager::MoveToNextFrame()
{
	m_nSwapChainBufferIndex = m_pdxgiSwapChain->GetCurrentBackBufferIndex();
	//m_nSwapChainBufferIndex = (m_nSwapChainBufferIndex + 1) % m_nSwapChainBuffers;

	UINT64 nFenceValue = ++m_nFenceValues[m_nSwapChainBufferIndex];
	HRESULT hResult = m_pd3dCommandQueue->Signal(m_pd3dFence, nFenceValue);

	if (m_pd3dFence->GetCompletedValue() < nFenceValue)
	{
		hResult = m_pd3dFence->SetEventOnCompletion(nFenceValue, m_hFenceEvent);
		::WaitForSingleObject(m_hFenceEvent, INFINITE);
	}
}

ID3D12Resource* CDeviceManager::CurrentBackBuffer()const
{
	return m_ppd3dSwapChainBackBuffers[m_nSwapChainBufferIndex];
}
D3D12_CPU_DESCRIPTOR_HANDLE CDeviceManager::CurrentBackBufferView()const
{
	return CD3DX12_CPU_DESCRIPTOR_HANDLE(
		m_pd3dRtvDescriptorHeap->GetCPUDescriptorHandleForHeapStart(),
		m_nSwapChainBufferIndex,
		m_nRtvDescriptorIncrementSize);
}

