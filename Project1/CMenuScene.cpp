#include "stdafx.h"
#include "CMenuScene.h"
#include "CNumber.h"
#include "CUI.h"
#include "CLockOnUI.h"
#include "CShaderManager.h"
#include "CSphereCollider.h"

/*D3D12DescriptorHeap* CMenuScene::m_pd3dCbvSrvDescriptorHeap = NULL;

D3D12_CPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dCbvCPUDescriptorStartHandle;
D3D12_GPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dCbvGPUDescriptorStartHandle;
D3D12_CPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dSrvCPUDescriptorStartHandle;
D3D12_GPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dSrvGPUDescriptorStartHandle;

D3D12_CPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dCbvCPUDescriptorNextHandle;
D3D12_GPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dCbvGPUDescriptorNextHandle;
D3D12_CPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dSrvCPUDescriptorNextHandle;
D3D12_GPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dSrvGPUDescriptorNextHandle;*/

CMenuScene::CMenuScene()
{
}

CMenuScene::~CMenuScene()
{
}


void CMenuScene::BuildObjects(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList)
{
	m_pd3dGraphicsRootSignature = CreateGraphicsRootSignature(pd3dDevice);
	m_pd3dComputeRootSignature = CreatePostProcessRootSignature(pd3dDevice);

	CreateCbvSrvDescriptorHeaps(pd3dDevice, pd3dCommandList, 0, 76); //SuperCobra(17), Gunship(2), Player:Mi24(1), Angrybot()

	CMaterial::PrepareShaders(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);

	BuildDefaultLightsAndMaterials();

	m_nGameObjects = 1;
	m_ppGameObjects = new CGameObject * [m_nGameObjects];
	m_ppGameObjects[0] = new CUI(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.2f, 0.3f, 0.f, XMFLOAT2(0.5f, 0.5f), XMFLOAT2(0.5f, 0.5f), XMFLOAT2(0.5f, 0.5f), XMFLOAT2(0.5f, 0.5f));
	

	m_ObjManager->AddObject(L"player_ui1_testui", m_ppGameObjects[0], OBJ_UI);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);
}

void CMenuScene::ReleaseObjects()
{
	if (m_pd3dGraphicsRootSignature) m_pd3dGraphicsRootSignature->Release();
	if (m_pd3dComputeRootSignature) m_pd3dComputeRootSignature->Release();
	if (m_pd3dCbvSrvDescriptorHeap) m_pd3dCbvSrvDescriptorHeap->Release();

	m_ObjManager->ReleaseAll();

	ReleaseShaderVariables();
}

void CMenuScene::CreateShaderVariables(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList)
{

}

void CMenuScene::UpdateShaderVariables(ID3D12GraphicsCommandList* pd3dCommandList)
{
}

void CMenuScene::ReleaseShaderVariables()
{
}

void CMenuScene::ReleaseUploadBuffers()
{
	m_ObjManager->ReleaseUploadBuffers();
}

bool CMenuScene::OnProcessingMouseMessage(HWND hWnd, UINT nMessageID, WPARAM wParam, LPARAM lParam)
{
	return(false);
}

bool CMenuScene::OnProcessingKeyboardMessage(HWND hWnd, UINT nMessageID, WPARAM wParam, LPARAM lParam)
{
	switch (nMessageID)
	{
	case WM_KEYDOWN:
		switch (wParam)
		{
		case '1':
		case '2':
			break;
		}
		break;
	default:
		break;
	}
	return(false);
}

bool CMenuScene::ProcessInput(UCHAR* pKeysBuffer)
{
	return(false);
}

void CMenuScene::AnimateObjects(float fTimeElapsed)
{
	m_fElapsedTime += fTimeElapsed;

	m_ObjManager->Update(fTimeElapsed);
}

void CMenuScene::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera, ID3D12Resource* pCurrentBackBuffer)
{

	if (m_pd3dGraphicsRootSignature) pd3dCommandList->SetGraphicsRootSignature(m_pd3dGraphicsRootSignature);
	if (m_pd3dComputeRootSignature) pd3dCommandList->SetComputeRootSignature(m_pd3dComputeRootSignature);

	if (m_pd3dCbvSrvDescriptorHeap) pd3dCommandList->SetDescriptorHeaps(1, &m_pd3dCbvSrvDescriptorHeap);

	pCamera->SetViewportsAndScissorRects(pd3dCommandList);
	pCamera->UpdateShaderVariables(pd3dCommandList);

	UpdateShaderVariables(pd3dCommandList);

	m_ObjManager->Render(pd3dCommandList, pCamera);
}