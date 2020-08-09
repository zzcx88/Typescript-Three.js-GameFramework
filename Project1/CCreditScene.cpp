#include "stdafx.h"
#include "CCreditScene.h"
#include "CTestScene.h"
#include "CNumber.h"
#include "CUI.h"
#include "CAnimateUI.h"
#include "AnimateMenuTitle.h"
#include "CLockOnUI.h"
#include "CShaderManager.h"
#include "CSphereCollider.h"

//ID3D12DescriptorHeap* CMenuScene::m_pd3dCbvSrvDescriptorHeap = NULL;
//
//D3D12_CPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dCbvCPUDescriptorStartHandle;
//D3D12_GPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dCbvGPUDescriptorStartHandle;
//D3D12_CPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dSrvCPUDescriptorStartHandle;
//D3D12_GPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dSrvGPUDescriptorStartHandle;
//
//D3D12_CPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dCbvCPUDescriptorNextHandle;
//D3D12_GPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dCbvGPUDescriptorNextHandle;
//D3D12_CPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dSrvCPUDescriptorNextHandle;
//D3D12_GPU_DESCRIPTOR_HANDLE	CMenuScene::m_d3dSrvGPUDescriptorNextHandle;

CCreditScene::CCreditScene()
{
}

CCreditScene::~CCreditScene()
{
}


void CCreditScene::BuildObjects(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList)
{
	GET_MANAGER<SoundManager>()->PlayBGM(L"EndingCredit.mp3", CH_BGM);
	m_pd3dGraphicsRootSignature = CreateGraphicsRootSignature(pd3dDevice);
	m_pd3dComputeRootSignature = CreatePostProcessRootSignature(pd3dDevice);

	CreateCbvSrvDescriptorHeaps(pd3dDevice, pd3dCommandList, 0, 76); //SuperCobra(17), Gunship(2), Player:Mi24(1), Angrybot()

	CMaterial::PrepareShaders(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);

	BuildDefaultLightsAndMaterials();

	//float fx = 1.f / 0.96f;
	//float fy = 1.f / 0.54f;
	m_nGameObjects = 5;
	m_ppGameObjects = new CGameObject * [m_nGameObjects];

	// ¿£µù Å©·¹µ÷
	m_ppGameObjects[0] = new CAnimateUI(1, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 2.f, 2.f, 0.f, XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
	m_ppGameObjects[0]->SetIsRender(false);
	m_ppGameObjects[0]->m_fBurnerBlendAmount = 0.0f;
	m_ppGameObjects[0]->SetPosition(0.f, 0.f, 0.f);

	m_ppGameObjects[1] = new CAnimateUI(3, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 2.f, 2.f, 0.f, XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
	m_ppGameObjects[1]->SetIsRender(false);
	m_ppGameObjects[1]->m_fBurnerBlendAmount = 0.0f;
	m_ppGameObjects[1]->SetPosition(0.f, 0.f, 0.f);

	m_ppGameObjects[2] = new CAnimateUI(4, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 2.f, 2.f, 0.f, XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
	m_ppGameObjects[2]->SetIsRender(false);
	m_ppGameObjects[2]->m_fBurnerBlendAmount = 0.0f;
	m_ppGameObjects[2]->SetPosition(0.f, 0.f, 0.f);

	m_ppGameObjects[3] = new CAnimateUI(5, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 2.f, 2.f, 0.f, XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
	m_ppGameObjects[3]->SetIsRender(false);
	m_ppGameObjects[3]->m_fBurnerBlendAmount = 0.0f;
	m_ppGameObjects[3]->SetPosition(0.f, 0.f, 0.f);

	m_ppGameObjects[4] = new CAnimateUI(6, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 2.f, 2.f, 0.f, XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
	m_ppGameObjects[4]->SetIsRender(false);
	m_ppGameObjects[4]->m_fBurnerBlendAmount = 0.0f;
	m_ppGameObjects[4]->SetPosition(0.f, 0.f, 0.f);

	m_ObjManager->AddObject(L"player_ui1_ending", m_ppGameObjects[0], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui2_ending_credit_background1", m_ppGameObjects[1], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui3_ending_credit_background2", m_ppGameObjects[2], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui4_ending_credit_background3", m_ppGameObjects[3], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui5_ending_credit_background4", m_ppGameObjects[4], OBJ_UI);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);
}

void CCreditScene::ReleaseObjects()
{
	if (m_pd3dGraphicsRootSignature) m_pd3dGraphicsRootSignature->Release();
	if (m_pd3dComputeRootSignature) m_pd3dComputeRootSignature->Release();
	if (m_pd3dCbvSrvDescriptorHeap) m_pd3dCbvSrvDescriptorHeap->Release();

	m_ObjManager->ReleaseAll();

	ReleaseShaderVariables();
}

void CCreditScene::CreateShaderVariables(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList)
{

}

void CCreditScene::UpdateShaderVariables(ID3D12GraphicsCommandList* pd3dCommandList)
{
}

void CCreditScene::ReleaseShaderVariables()
{
}

void CCreditScene::ReleaseUploadBuffers()
{
	m_ObjManager->ReleaseUploadBuffers();
}

bool CCreditScene::OnProcessingMouseMessage(HWND hWnd, UINT nMessageID, WPARAM wParam, LPARAM lParam)
{
	return(false);
}

bool CCreditScene::OnProcessingKeyboardMessage(HWND hWnd, UINT nMessageID, WPARAM wParam, LPARAM lParam)
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

bool CCreditScene::ProcessInput(UCHAR* pKeysBuffer)
{
	return(false);
}

void CCreditScene::AnimateObjects(float fTimeElapsed)
{
	float x = 1.f;
	if (m_bSceneStart)
	{
		m_fElapsedTime += fTimeElapsed;
		m_ppGameObjects[0]->SetIsRender(true);
		m_ppGameObjects[1]->SetIsRender(true);

		m_ppGameObjects[0]->m_fBurnerBlendAmount += x * fTimeElapsed;
		m_ppGameObjects[1]->m_fBurnerBlendAmount += x * fTimeElapsed;

		if (m_fElapsedTime > 3)
		{
			m_fElapsedTime = 0;
			m_bSceneStart = false;
			m_ppGameObjects[1]->SetIsRender(false);
			m_ppGameObjects[2]->SetIsRender(true);

		}
		//m_ppGameObjects[0]->SetPosition(0.f, m_ppGameObjects[0]->GetPosition().y + fTimeElapsed * 0.01f, 0.f);
	}
	if (m_ppGameObjects[2]->GetIsRender())
	{
		m_fElapsedTime += fTimeElapsed;
		m_ppGameObjects[2]->m_fBurnerBlendAmount += x * fTimeElapsed;
		if (m_fElapsedTime > 3)
		{
			m_fElapsedTime = 0;
			m_ppGameObjects[2]->SetIsRender(false);
			m_ppGameObjects[3]->SetIsRender(true);
		}
	}
	if (m_ppGameObjects[3]->GetIsRender())
	{
		m_fElapsedTime += fTimeElapsed;
		m_ppGameObjects[3]->m_fBurnerBlendAmount += x * fTimeElapsed;
		if (m_fElapsedTime > 3)
		{
			m_fElapsedTime = 0;
			m_ppGameObjects[3]->SetIsRender(false);
			m_ppGameObjects[4]->SetIsRender(true);
		}
	}
	if (m_ppGameObjects[4]->GetIsRender())
	{
		m_fElapsedTime += fTimeElapsed;
		m_ppGameObjects[4]->m_fBurnerBlendAmount += x * fTimeElapsed;
		if (m_fElapsedTime > 3)
		{
			m_fElapsedTime = 0;
			m_ppGameObjects[4]->SetIsRender(false);
		}
	}


	m_ObjManager->Update(fTimeElapsed);
}

void CCreditScene::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera, bool bPreRender, ID3D12Resource* pCurrentBackBuffer)
{

	if (m_pd3dGraphicsRootSignature) pd3dCommandList->SetGraphicsRootSignature(m_pd3dGraphicsRootSignature);
	if (m_pd3dComputeRootSignature) pd3dCommandList->SetComputeRootSignature(m_pd3dComputeRootSignature);

	if (m_pd3dCbvSrvDescriptorHeap) pd3dCommandList->SetDescriptorHeaps(1, &m_pd3dCbvSrvDescriptorHeap);

	pCamera->SetViewportsAndScissorRects(pd3dCommandList);
	pCamera->UpdateShaderVariables(pd3dCommandList);

	UpdateShaderVariables(pd3dCommandList);

	m_ObjManager->Render(pd3dCommandList, pCamera);
}