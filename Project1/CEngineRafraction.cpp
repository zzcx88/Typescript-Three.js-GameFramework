#include "stdafx.h"
#include "CEngineRafraction.h"
#include "CPlaneMesh.h"
#include "CTestScene.h"
#include "CShaderManager.h"

CEngineRafraction::CEngineRafraction()
{
}

CEngineRafraction::CEngineRafraction(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth)
{
	pd3dDevice->CreateCommandAllocator(D3D12_COMMAND_LIST_TYPE_DIRECT, __uuidof(ID3D12CommandAllocator), (void**)&m_pd3dCommandAllocator);
	pd3dDevice->CreateCommandList(0, D3D12_COMMAND_LIST_TYPE_DIRECT, m_pd3dCommandAllocator, NULL, __uuidof(ID3D12GraphicsCommandList), (void**)&m_pd3dCommandList);
	m_pd3dCommandList->Close();

	//m_bReffernce = true;
	m_fBurnerBlendAmount = 1;
	m_pPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth, XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0));
	m_pPlaneMeshDrop = new CPlaneMesh(pd3dDevice, pd3dCommandList, 3, 3, fDepth, XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0),7,7);
	SetMesh(m_pPlaneMesh);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	//m_pEffectTexture[TEXTURES];
	m_pEffectTexture[0] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pEffectTexture[0]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/Heat_Distortion_Normal.dds", 0);
	m_pEffectTexture[2] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pEffectTexture[2]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/waterdrop_Normal.dds", 0);

	D3D12_DESCRIPTOR_HEAP_DESC d3dDescriptorHeapDesc;
	d3dDescriptorHeapDesc.NumDescriptors = 1;
	d3dDescriptorHeapDesc.Type = D3D12_DESCRIPTOR_HEAP_TYPE_RTV;
	d3dDescriptorHeapDesc.Flags = D3D12_DESCRIPTOR_HEAP_FLAG_NONE;
	d3dDescriptorHeapDesc.NodeMask = 0;
	pd3dDevice->CreateDescriptorHeap(&d3dDescriptorHeapDesc, __uuidof(ID3D12DescriptorHeap), (void**)&m_pd3dRtvDescriptorHeap);
	m_nRtvDescriptorIncrementSize = pd3dDevice->GetDescriptorHandleIncrementSize(D3D12_DESCRIPTOR_HEAP_TYPE_RTV);

	D3D12_CPU_DESCRIPTOR_HANDLE d3dRtvCPUDescriptorHandle = m_pd3dRtvDescriptorHeap->GetCPUDescriptorHandleForHeapStart();

	d3dDescriptorHeapDesc.NumDescriptors = 1;
	d3dDescriptorHeapDesc.Type = D3D12_DESCRIPTOR_HEAP_TYPE_DSV;
	d3dDescriptorHeapDesc.Flags = D3D12_DESCRIPTOR_HEAP_FLAG_NONE;
	d3dDescriptorHeapDesc.NodeMask = 0;
	HRESULT hResult = pd3dDevice->CreateDescriptorHeap(&d3dDescriptorHeapDesc, __uuidof(ID3D12DescriptorHeap), (void**)&m_pd3dDsvDescriptorHeap);

	D3D12_CPU_DESCRIPTOR_HANDLE d3dDsvCPUDescriptorHandle = m_pd3dDsvDescriptorHeap->GetCPUDescriptorHandleForHeapStart();

	D3D12_CLEAR_VALUE d3dDsbClearValue = { DXGI_FORMAT_D24_UNORM_S8_UINT, { 1.0f, 0 } };
	m_pd3dDepthStencilBuffer = ::CreateTexture2DResource(pd3dDevice, pd3dCommandList, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT, 1, 1, DXGI_FORMAT_D24_UNORM_S8_UINT, D3D12_RESOURCE_FLAG_ALLOW_DEPTH_STENCIL, D3D12_RESOURCE_STATE_DEPTH_WRITE, &d3dDsbClearValue);
	m_d3dDsvCPUDescriptorHandle = d3dDsvCPUDescriptorHandle;
	pd3dDevice->CreateDepthStencilView(m_pd3dDepthStencilBuffer, NULL, m_d3dDsvCPUDescriptorHandle);

	m_pEffectTexture[1] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	D3D12_CLEAR_VALUE d3dRtbClearValue = { DXGI_FORMAT_R8G8B8A8_UNORM, { 0.0f, 0.0f, 0.0f, 1.0f } };
	ID3D12Resource* pd3dResource = m_pEffectTexture[1]->CreateTexture(pd3dDevice, pd3dCommandList, 0, RESOURCE_TEXTURE2D, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT, 1, 1, DXGI_FORMAT_R8G8B8A8_UNORM, D3D12_RESOURCE_FLAG_ALLOW_RENDER_TARGET, D3D12_RESOURCE_STATE_GENERIC_READ, &d3dRtbClearValue);
	
	CTestScene::CreateShaderResourceViews(pd3dDevice, m_pEffectTexture[1], 15, false);

	D3D12_RENDER_TARGET_VIEW_DESC d3dRTVDesc;
	d3dRTVDesc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
	d3dRTVDesc.ViewDimension = D3D12_RTV_DIMENSION_TEXTURE2D;
	d3dRTVDesc.Texture2D.MipSlice = 0;
	d3dRTVDesc.Texture2D.PlaneSlice = 0;

	m_pd3dRtvCPUDescriptorHandles = d3dRtvCPUDescriptorHandle;
	pd3dDevice->CreateRenderTargetView(pd3dResource, &d3dRTVDesc, m_pd3dRtvCPUDescriptorHandles);
	d3dRtvCPUDescriptorHandle.ptr += 32;

	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);
	
	m_pRafractionShader = new CRafractionShader();

	m_pRafractionShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	m_pRafractionShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);

	CTestScene::CreateShaderResourceViews(pd3dDevice, m_pEffectTexture[0], 5, false);
	CTestScene::CreateShaderResourceViews(pd3dDevice, m_pEffectTexture[2], 5, false);

	m_pEffectMaterial = new CMaterial(2);
	m_pEffectMaterial->SetTexture(m_pEffectTexture[0], 0);
	m_pEffectMaterial->SetTexture(m_pEffectTexture[1], 1);
	m_pEffectMaterial->SetShader(m_pRafractionShader);

	if (GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER))
	{
		m_pCamera = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera;
	}

	///////////////////////////새 카메라를 만들 경우/////////////////////
	/*if (m_pCamera == NULL)
	{
		m_pCamera = new CCamera();
		m_pCamera->SetViewport(0, 0, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT, 0.0f, 1.0f);
		m_pCamera->SetScissorRect(0, 0, FRAME_BUFFER_WIDTH, FRAME_BUFFER_HEIGHT);
		m_pCamera->CreateShaderVariables(pd3dDevice, m_pd3dCommandList);
		m_pCamera->GenerateProjectionMatrix(1.01f, 50000.0f, ASPECT_RATIO, 60);
	}*/

	SetMaterial(0, m_pEffectMaterial);
}

CEngineRafraction::~CEngineRafraction()
{
	if (m_pd3dDepthStencilBuffer) m_pd3dDepthStencilBuffer->Release();

	if (m_pd3dDsvDescriptorHeap) m_pd3dDsvDescriptorHeap->Release();
	if (m_pd3dRtvDescriptorHeap) m_pd3dRtvDescriptorHeap->Release();

	if (m_pd3dCommandAllocator) m_pd3dCommandAllocator->Release();
	if (m_pd3dCommandList) m_pd3dCommandList->Release();
}

void CEngineRafraction::Animate(float fTimeElapsed)
{
	m_fTimeElapsed += fTimeElapsed;
	m_xmf3Position.x = m_xmf4x4ToParent._41;
	m_xmf3Position.y = m_xmf4x4ToParent._42;
	m_xmf3Position.z = m_xmf4x4ToParent._43;

	if (m_bWaterDrop == true)
	{
		m_pMesh = m_pPlaneMeshDrop;
		m_pEffectMaterial->m_ppTextures[0] = m_pEffectTexture[2];
		CCamera* pCamera = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera;
		if(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bEye_fixation == false)
			SetPosition(pCamera->GetPosition().x + pCamera->GetLookVector().x * 1.1f, pCamera->GetPosition().y + pCamera->GetLookVector().y * 1.1f, pCamera->GetPosition().z + pCamera->GetLookVector().z * 1.1f);
		else
			SetPosition(pCamera->GetPosition().x + pCamera->GetLookVector().x * 1.5f, pCamera->GetPosition().y + pCamera->GetLookVector().y * 1.5f, pCamera->GetPosition().z + pCamera->GetLookVector().z * 1.5f);
	}
	else
	{
		m_pMesh = m_pPlaneMesh;
		m_pEffectMaterial->m_ppTextures[0] = m_pEffectTexture[0];
		std::default_random_engine dre(m_fTimeElapsed * 100);
		std::uniform_real_distribution<float>range(0, 360);
		m_fRotateSpeed += range(dre);
		Rotate(0, 0, m_fRotateSpeed + 10);
	}
	
	SetLookAt(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera->GetPosition());

	float fRefractionAmount = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPlayerSpeed() * 0.00001f;
	if(fRefractionAmount < 0.003f && m_bWaterDrop == false)
		m_fBurnerBlendAmount = fRefractionAmount;
	else if (m_bWaterDrop == true)
	{
		m_fBurnerBlendAmount -= 0.1f * fTimeElapsed;
	}
}

void CEngineRafraction::TextureAnimate()
{
}

void CEngineRafraction::SetLookAt(XMFLOAT3& xmfTarget)
{
	XMFLOAT3 xmfUp(0.0f, 1.0f, 0.0f);
	XMFLOAT4X4 mtxLookAt = Matrix4x4::LookAtLH(xmfTarget, m_xmf3Position, xmfUp);
	m_xmf3Right = XMFLOAT3(mtxLookAt._11, mtxLookAt._21, mtxLookAt._31);
	m_xmf3Up = XMFLOAT3(mtxLookAt._12, mtxLookAt._22, mtxLookAt._32);
	if (m_bWaterDrop == true)
	{
		m_xmf3Right = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera->GetRightVector();
		m_xmf3Up = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera->GetUpVector();
	}
	m_xmf3Look = XMFLOAT3(mtxLookAt._13, mtxLookAt._23, mtxLookAt._33);
	m_xmf4x4ToParent._11 = m_xmf3Right.x;			m_xmf4x4ToParent._12 = m_xmf3Right.y;		m_xmf4x4ToParent._13 = m_xmf3Right.z;
	m_xmf4x4ToParent._21 = m_xmf3Up.x;			m_xmf4x4ToParent._22 = m_xmf3Up.y;		m_xmf4x4ToParent._23 = m_xmf3Up.z;
	m_xmf4x4ToParent._31 = m_xmf3Look.x;		m_xmf4x4ToParent._32 = m_xmf3Look.y;	m_xmf4x4ToParent._33 = m_xmf3Look.z;
}

void CEngineRafraction::OnPreRender(ID3D12Device* pd3dDevice, ID3D12CommandQueue* pd3dCommandQueue, ID3D12Fence* pd3dFence, HANDLE hFenceEvent)
{
	/////////////////////새 카메라를 만들었을 경우////////////////////////
	/*XMFLOAT3 xmf3Position = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera->GetPosition();
	m_pCamera->SetPosition(xmf3Position);
	m_pCamera->GenerateViewMatrix(xmf3Position, Vector3::Add(xmf3Position, GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera->GetLookVector()), GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera->GetUpVector());
	m_pCamera->GenerateProjectionMatrix(1.01f, 100000.0f, ASPECT_RATIO, GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetFov());*/
	
	if ((GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bEye_fixation == false && 
		GET_MANAGER<CDeviceManager>()->GetBlurAmount() <= 0.5f &&
		GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bMissleLockCamera == false && m_bWaterDrop == false) || m_bWaterDrop == true)
	{

		m_pd3dCommandAllocator->Reset();
		m_pd3dCommandList->Reset(m_pd3dCommandAllocator, NULL);

		GET_MANAGER<SceneManager>()->OnPrepareRender(m_pd3dCommandList);
		float pfClearColor[4] = { 0.0f, 0.0f, 0.0f, 1.0f };
		::SynchronizeResourceTransition(m_pd3dCommandList, m_pEffectTexture[1]->GetTexture(0), D3D12_RESOURCE_STATE_GENERIC_READ, D3D12_RESOURCE_STATE_RENDER_TARGET);

		m_pd3dCommandList->ClearRenderTargetView(m_pd3dRtvCPUDescriptorHandles, pfClearColor, 0, NULL);
		m_pd3dCommandList->ClearDepthStencilView(m_d3dDsvCPUDescriptorHandle, D3D12_CLEAR_FLAG_DEPTH | D3D12_CLEAR_FLAG_STENCIL, 1.0f, 0, 0, NULL);
		m_pd3dCommandList->OMSetRenderTargets(1, &m_pd3dRtvCPUDescriptorHandles, TRUE, &m_d3dDsvCPUDescriptorHandle);
		GET_MANAGER<SceneManager>()->Render(m_pd3dCommandList, m_pCamera, true);

		::SynchronizeResourceTransition(m_pd3dCommandList, m_pEffectTexture[1]->GetTexture(0), D3D12_RESOURCE_STATE_RENDER_TARGET, D3D12_RESOURCE_STATE_GENERIC_READ);


		m_pd3dCommandList->Close();

		ID3D12CommandList* ppd3dCommandLists[] = { m_pd3dCommandList };
		pd3dCommandQueue->ExecuteCommandLists(1, ppd3dCommandLists);

		UINT64 nFenceValue = pd3dFence->GetCompletedValue();
		::WaitForGpuComplete(pd3dCommandQueue, pd3dFence, nFenceValue + 1, hFenceEvent);
	}
}

void CEngineRafraction::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	if ((GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bEye_fixation == false && 
		GET_MANAGER<CDeviceManager>()->GetBlurAmount() <= 0.5f && 
		GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_bMissleLockCamera == false && m_bWaterDrop == false)|| m_bWaterDrop == true)
	{
		CGameObject::Render(pd3dCommandList, pCamera);
	}
}
