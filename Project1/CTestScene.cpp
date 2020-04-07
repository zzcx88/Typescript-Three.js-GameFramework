#include "stdafx.h"
#include "CTestScene.h"
#include "CHeightMapTerrain.h"
#include "CSkyBox.h"
#include "CUI.h"
#include "CAngrybotObject.h"
#include "CGunshipObject.h"
#include "CSuperCobraObject.h"
#include "CShaderManager.h"
#include "CSphereCollider.h"
#include "CMissle.h"
#include "CMissleFog.h"



ID3D12DescriptorHeap* CTestScene::m_pd3dCbvSrvDescriptorHeap = NULL;

D3D12_CPU_DESCRIPTOR_HANDLE	CTestScene::m_d3dCbvCPUDescriptorStartHandle;
D3D12_GPU_DESCRIPTOR_HANDLE	CTestScene::m_d3dCbvGPUDescriptorStartHandle;
D3D12_CPU_DESCRIPTOR_HANDLE	CTestScene::m_d3dSrvCPUDescriptorStartHandle;
D3D12_GPU_DESCRIPTOR_HANDLE	CTestScene::m_d3dSrvGPUDescriptorStartHandle;
													
D3D12_CPU_DESCRIPTOR_HANDLE	CTestScene::m_d3dCbvCPUDescriptorNextHandle;
D3D12_GPU_DESCRIPTOR_HANDLE	CTestScene::m_d3dCbvGPUDescriptorNextHandle;
D3D12_CPU_DESCRIPTOR_HANDLE	CTestScene::m_d3dSrvCPUDescriptorNextHandle;
D3D12_GPU_DESCRIPTOR_HANDLE	CTestScene::m_d3dSrvGPUDescriptorNextHandle;

CTestScene::CTestScene()
{
}

CTestScene::~CTestScene()
{
}

void CTestScene::BuildDefaultLightsAndMaterials()
{
	m_nLights = 5;
	m_pLights = new LIGHT[m_nLights];
	::ZeroMemory(m_pLights, sizeof(LIGHT) * m_nLights);

	m_xmf4GlobalAmbient = XMFLOAT4(0.15f, 0.15f, 0.15f, 1.0f);

	m_pLights[0].m_bEnable = true;
	m_pLights[0].m_nType = POINT_LIGHT;
	m_pLights[0].m_fRange = 300.0f;
	m_pLights[0].m_xmf4Ambient = XMFLOAT4(0.2f, 0.2f, 0.2f, 1.0f);
	m_pLights[0].m_xmf4Diffuse = XMFLOAT4(0.4f, 0.3f, 0.8f, 1.0f);
	m_pLights[0].m_xmf4Specular = XMFLOAT4(0.5f, 0.5f, 0.5f, 0.0f);
	m_pLights[0].m_xmf3Position = XMFLOAT3(230.0f, 330.0f, 480.0f);
	m_pLights[0].m_xmf3Attenuation = XMFLOAT3(1.0f, 0.001f, 0.0001f);
	m_pLights[1].m_bEnable = true;
	m_pLights[1].m_nType = SPOT_LIGHT;
	m_pLights[1].m_fRange = 500.0f;
	m_pLights[1].m_xmf4Ambient = XMFLOAT4(0.1f, 0.1f, 0.1f, 1.0f);
	m_pLights[1].m_xmf4Diffuse = XMFLOAT4(0.4f, 0.4f, 0.4f, 1.0f);
	m_pLights[1].m_xmf4Specular = XMFLOAT4(0.3f, 0.3f, 0.3f, 0.0f);
	m_pLights[1].m_xmf3Position = XMFLOAT3(-50.0f, 20.0f, -5.0f);
	m_pLights[1].m_xmf3Direction = XMFLOAT3(0.0f, 0.0f, 1.0f);
	m_pLights[1].m_xmf3Attenuation = XMFLOAT3(1.0f, 0.01f, 0.0001f);
	m_pLights[1].m_fFalloff = 8.0f;
	m_pLights[1].m_fPhi = (float)cos(XMConvertToRadians(40.0f));
	m_pLights[1].m_fTheta = (float)cos(XMConvertToRadians(20.0f));
	m_pLights[2].m_bEnable = true;
	m_pLights[2].m_nType = DIRECTIONAL_LIGHT;
	m_pLights[2].m_xmf4Ambient = XMFLOAT4(0.3f, 0.3f, 0.3f, 1.0f);
	m_pLights[2].m_xmf4Diffuse = XMFLOAT4(0.7f, 0.7f, 0.7f, 1.0f);
	m_pLights[2].m_xmf4Specular = XMFLOAT4(0.4f, 0.4f, 0.4f, 0.0f);
	m_pLights[2].m_xmf3Direction = XMFLOAT3(0.02f, -0.5f, -0.15f);
	m_pLights[3].m_bEnable = true;
	m_pLights[3].m_nType = SPOT_LIGHT;
	m_pLights[3].m_fRange = 600.0f;
	m_pLights[3].m_xmf4Ambient = XMFLOAT4(0.3f, 0.3f, 0.3f, 1.0f);
	m_pLights[3].m_xmf4Diffuse = XMFLOAT4(0.3f, 0.7f, 0.0f, 1.0f);
	m_pLights[3].m_xmf4Specular = XMFLOAT4(0.3f, 0.3f, 0.3f, 0.0f);
	m_pLights[3].m_xmf3Position = XMFLOAT3(550.0f, 530.0f, 530.0f);
	m_pLights[3].m_xmf3Direction = XMFLOAT3(0.0f, 1.0f, 1.0f);
	m_pLights[3].m_xmf3Attenuation = XMFLOAT3(1.0f, 0.01f, 0.0001f);
	m_pLights[3].m_fFalloff = 8.0f;
	m_pLights[3].m_fPhi = (float)cos(XMConvertToRadians(90.0f));
	m_pLights[3].m_fTheta = (float)cos(XMConvertToRadians(30.0f));
	m_pLights[4].m_bEnable = true;
	m_pLights[4].m_nType = POINT_LIGHT;
	m_pLights[4].m_fRange = 200.0f;
	m_pLights[4].m_xmf4Ambient = XMFLOAT4(0.2f, 0.2f, 0.2f, 1.0f);
	m_pLights[4].m_xmf4Diffuse = XMFLOAT4(0.8f, 0.3f, 0.3f, 1.0f);
	m_pLights[4].m_xmf4Specular = XMFLOAT4(0.5f, 0.5f, 0.5f, 0.0f);
	m_pLights[4].m_xmf3Position = XMFLOAT3(600.0f, 250.0f, 700.0f);
	m_pLights[4].m_xmf3Attenuation = XMFLOAT3(1.0f, 0.001f, 0.0001f);
}

void CTestScene::BuildObjects(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList)
{
	m_pd3dGraphicsRootSignature = CreateGraphicsRootSignature(pd3dDevice);
	m_pd3dComputeRootSignature = CreatePostProcessRootSignature(pd3dDevice);

	CreateCbvSrvDescriptorHeaps(pd3dDevice, pd3dCommandList, 0, 76); //SuperCobra(17), Gunship(2), Player:Mi24(1), Angrybot()
	

	CMaterial::PrepareShaders(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);

	BuildDefaultLightsAndMaterials();

	m_pSkyBox = new CSkyBox(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);

	m_ObjManager->AddObject(L"skybox", m_pSkyBox, OBJ_MAP);

	m_nGameObjects = 7;
	m_ppGameObjects = new CGameObject* [m_nGameObjects];
	m_ppGameObjects[0] = new CUI(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.2f, 0.3f, 0.f , XMFLOAT2(0.5f,0.5f), XMFLOAT2(0.5f,0.5f) , XMFLOAT2(0.5f,0.5f), XMFLOAT2(0.5f, 0.5f));
	m_ppGameObjects[1] = new CUI(1, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.2f, 0.35f, 0.f, XMFLOAT2(0.725f, -0.45f), XMFLOAT2(0.725f, -0.45f), XMFLOAT2(0.725f, -0.45f), XMFLOAT2(0.725f, -0.45f));
	m_ppGameObjects[2] = new CUI(2, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.15f, 0.25f, 0.f, XMFLOAT2(-0.875f, 0.8f), XMFLOAT2(-0.875f, 0.8f), XMFLOAT2(-0.875f, 0.8f), XMFLOAT2(-0.875f, 0.8f));
	m_ppGameObjects[3] = new CUI(3, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.125f, 0.2f, 0.f, XMFLOAT2(-0.25f, 0.f), XMFLOAT2(-0.25f, 0.f), XMFLOAT2(-0.25f, 0.f), XMFLOAT2(-0.25f, 0.0f));
	m_ppGameObjects[4] = new CUI(4, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.125f, 0.2f, 0.f, XMFLOAT2(0.25f, 0.f), XMFLOAT2(0.25f, 0.f), XMFLOAT2(0.25f, 0.f), XMFLOAT2(0.25f, 0.0f));
	m_ppGameObjects[5] = new CUI(5, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.1f, 0.3f, 0.f, XMFLOAT2(0.81f, -0.305f), XMFLOAT2(0.81f, -0.305f), XMFLOAT2(0.81f, -0.305f), XMFLOAT2(0.81f, -0.305f));
	m_ppGameObjects[6] = new CUI(6, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.3f, 0.3f, 0.f, XMFLOAT2(-0.8f, -0.5f), XMFLOAT2(-0.8f, -0.7f), XMFLOAT2(-0.8f, -0.7f), XMFLOAT2(-0.8f, -0.5f));
	m_ObjManager->AddObject(L"player_ui1", m_ppGameObjects[0], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui2", m_ppGameObjects[1], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui3", m_ppGameObjects[2], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui4", m_ppGameObjects[3], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui5", m_ppGameObjects[4], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui6", m_ppGameObjects[5], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui7", m_ppGameObjects[6], OBJ_UI);

	XMFLOAT3 xmf3Scale(8.0f, 2.0f, 8.0f);
	XMFLOAT4 xmf4Color(0.0f, 0.3f, 0.0f, 0.0f);
	m_pTerrain = new CHeightMapTerrain(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, _T("Terrain/HeightMap.raw"), 257, 257, xmf3Scale, xmf4Color);
	m_ObjManager->AddObject(L"terrain", m_pTerrain, OBJ_MAP);

	m_nHierarchicalGameObjects = 4;
	m_ppHierarchicalGameObjects = new CGameObject * [m_nHierarchicalGameObjects];

	CLoadedModelInfo* pAngrybotModel = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, "Model/Angrybot.bin", NULL, MODEL_ANI);
	CLoadedModelInfo* pWaterModel = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, "Model/water.bin", NULL, MODEL_STD);
	CLoadedModelInfo* p052C = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, "Model/052C.bin", NULL, MODEL_STD);
	CLoadedModelInfo* pSphere = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, "Model/Sphere.bin", NULL, MODEL_STD);
	CLoadedModelInfo* pMissle = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, "Model/Missle.bin", NULL, MODEL_ACE);
	m_ppHierarchicalGameObjects[0] = new CAngrybotObject(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, pAngrybotModel, 1);
	m_ppHierarchicalGameObjects[0]->m_pSkinnedAnimationController->SetTrackAnimationSet(0, 0);
	m_ppHierarchicalGameObjects[0]->SetPosition(410.0f, m_pTerrain->GetHeight(410.0f, 735.0f), 735.0f);
	m_ppHierarchicalGameObjects[1] = new CAngrybotObject(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, pAngrybotModel, 1);
	m_ppHierarchicalGameObjects[1]->m_pSkinnedAnimationController->SetTrackAnimationSet(0, 0);
	m_ppHierarchicalGameObjects[1]->SetPosition(410.0f, m_pTerrain->GetHeight(410.0f, 775.0f) + 40, 735.0f);
	m_ppHierarchicalGameObjects[1]->SetScale(1, 1, 1);
	m_ppHierarchicalGameObjects[2] = new CGunshipObject(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	m_ppHierarchicalGameObjects[2]->SetChild(pWaterModel->m_pModelRootObject);
	m_ppHierarchicalGameObjects[2]->SetPosition(0, 200, 0);
	m_ppHierarchicalGameObjects[3] = new CGunshipObject(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	m_ppHierarchicalGameObjects[3]->SetChild(p052C->m_pModelRootObject);
	m_ppHierarchicalGameObjects[3]->SetScale(50,50,50);
	m_ppHierarchicalGameObjects[3]->SetPosition(410, 200, -5000);

	m_ppHierarchicalGameObjects[4] = new CGunshipObject(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	m_ppHierarchicalGameObjects[4]->SetChild(pMissle->m_pModelRootObject);
	m_ppHierarchicalGameObjects[4]->SetPosition(410, 800, -5000);
	m_ppHierarchicalGameObjects[4]->SetScale(50, 50, 50);
	m_ObjManager->AddObject(L"enemy", m_ppHierarchicalGameObjects[0], OBJ_ENEMY);
	m_ObjManager->AddObject(L"enemy", m_ppHierarchicalGameObjects[1], OBJ_ENEMY);
	m_ObjManager->AddObject(L"water", m_ppHierarchicalGameObjects[2], OBJ_MAP);
	m_ObjManager->AddObject(L"destroyer", m_ppHierarchicalGameObjects[3], OBJ_ENEMY);
	m_ObjManager->AddObject(L"Sphere", m_ppHierarchicalGameObjects[4], OBJ_ENEMY);

	CSuperCobraObject* pSphereCollider;
	pSphereCollider = new CSuperCobraObject(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	pSphereCollider->SetChild(p052C->m_pModelRootObject);
	//m_pSphereCollider->SetPosition(410, 1000, 6000);
	pSphereCollider->SetPosition(410, 1000, -3000);
	pSphereCollider->SetScale(10,10,10);
	m_ObjManager->AddObject(L"SphereCollider", pSphereCollider, OBJ_ENEMY);

	//Prepare EffectObject
	//////////////////////////////////////////////////////
	m_pMissleFog = new CMissleFog(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 4.f, 4.f, 0.f);
	m_pMissleFog->m_bRefference = true;
	//pMissleFog->SetPosition(0.f, -1000.f, 0.f);
	//m_pMissleFog->SetScale(500,500,0);
	//pMissleFog->SetPosition(410, 1000, -3000);
	m_ObjManager->AddObject(L"MissleFog", m_pMissleFog, OBJ_EFFECT);


	/*XMFLOAT3 temp(0,0,0);
	CMissle* m_pMissle;
	m_pMissle = new CMissle(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, temp);
	m_pMissle->SetChild(pMissle->m_pModelRootObject);
	m_pMissle->SetPosition(410, 600, -2000);
	m_pMissle->SetScale(50, 50, 50);
	m_ObjManager->AddObject(L"MissleCollider", m_pMissle, OBJ_MISSLE);*/


	CreateShaderVariables(pd3dDevice, pd3dCommandList);
}

void CTestScene::ReleaseObjects()
{
	if (m_pd3dGraphicsRootSignature) m_pd3dGraphicsRootSignature->Release();
	if (m_pd3dComputeRootSignature) m_pd3dComputeRootSignature->Release();
	if (m_pd3dCbvSrvDescriptorHeap) m_pd3dCbvSrvDescriptorHeap->Release();

	m_ObjManager->ReleaseAll();

	ReleaseShaderVariables();
	
	if (m_pLights) delete[] m_pLights;
}

void CTestScene::CreateShaderVariables(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList)
{
	UINT ncbElementBytes = ((sizeof(LIGHTS) + 255) & ~255); //256ÀÇ ¹è¼ö
	m_pd3dcbLights = ::CreateBufferResource(pd3dDevice, pd3dCommandList, NULL, ncbElementBytes, D3D12_HEAP_TYPE_UPLOAD, D3D12_RESOURCE_STATE_VERTEX_AND_CONSTANT_BUFFER, NULL);

	m_pd3dcbLights->Map(0, NULL, (void**)&m_pcbMappedLights);
}

void CTestScene::UpdateShaderVariables(ID3D12GraphicsCommandList* pd3dCommandList)
{
	::memcpy(m_pcbMappedLights->m_pLights, m_pLights, sizeof(LIGHT) * m_nLights);
	::memcpy(&m_pcbMappedLights->m_xmf4GlobalAmbient, &m_xmf4GlobalAmbient, sizeof(XMFLOAT4));
	::memcpy(&m_pcbMappedLights->m_nLights, &m_nLights, sizeof(int));
}

void CTestScene::ReleaseShaderVariables()
{
	if (m_pd3dcbLights)
	{
		m_pd3dcbLights->Unmap(0, NULL);
		m_pd3dcbLights->Release();
	}
}

void CTestScene::ReleaseUploadBuffers()
{

	m_ObjManager->ReleaseUploadBuffers();

}

bool CTestScene::OnProcessingMouseMessage(HWND hWnd, UINT nMessageID, WPARAM wParam, LPARAM lParam)
{
	return(false);
}

bool CTestScene::OnProcessingKeyboardMessage(HWND hWnd, UINT nMessageID, WPARAM wParam, LPARAM lParam)
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

bool CTestScene::ProcessInput(UCHAR* pKeysBuffer)
{
	return(false);
}

void CTestScene::AnimateObjects(float fTimeElapsed)
{
	if (m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->SphereCollider->m_BoundingSphere.Center.z != 0)
	{
		if (m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->SphereCollider->m_BoundingSphere.Intersects(m_pPlayer->SphereCollider->m_BoundingSphere))
		{
			//m_pPlayer->SetPosition(XMFLOAT3(0, 0 ,0));
			cout << "Player : " << m_pPlayer->SphereCollider->m_BoundingSphere.Center.z << ", Sphere : " << m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->SphereCollider->m_BoundingSphere.Center.z << endl;
			//m_ObjManager->ReleaseObjFromTag(L"SphereCollider", OBJ_ENEMY);
		}
		if (m_ObjManager->GetObjFromTag(L"player_missle", OBJ_ENEMY))
			cout << m_ObjManager->GetObjFromTag(L"player_missle", OBJ_ENEMY)->m_xmf4x4World._41 << endl;
	}

	/*if (m_ObjManager->GetObjFromTag(L"player_missle", OBJ_MISSLE))
	{
		if (m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->SphereCollider->m_BoundingSphere.Intersects(m_ObjManager->GetObjFromTag(L"player_missle", OBJ_MISSLE)->SphereCollider->m_BoundingSphere))
		{
			cout << "Player : " << m_pPlayer->SphereCollider->m_BoundingSphere.Center.z << ", player_missle : " << 
				m_ObjManager->GetObjFromTag(L"player_missle", OBJ_MISSLE)->SphereCollider->m_BoundingSphere.Center.z << endl;
		}
		if (m_ObjManager->GetObjFromTag(L"player_missle", OBJ_ENEMY))
			cout << m_ObjManager->GetObjFromTag(L"player_missle", OBJ_ENEMY)->m_xmf4x4World._41 << endl;
	}*/
	m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->Rotate(0,0.1,0);
	m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->MoveForward(200 * fTimeElapsed);
	//m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->MoveUp(2);
	m_fElapsedTime = fTimeElapsed;
	m_ObjManager->Update(fTimeElapsed);
}

void CTestScene::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera, ID3D12Resource* pCurrentBackBuffer)
{

	if (m_pd3dGraphicsRootSignature) pd3dCommandList->SetGraphicsRootSignature(m_pd3dGraphicsRootSignature);
	if (m_pd3dComputeRootSignature) pd3dCommandList->SetComputeRootSignature(m_pd3dComputeRootSignature);

	if (m_pd3dCbvSrvDescriptorHeap) pd3dCommandList->SetDescriptorHeaps(1, &m_pd3dCbvSrvDescriptorHeap);


	pCamera->SetViewportsAndScissorRects(pd3dCommandList);
	pCamera->UpdateShaderVariables(pd3dCommandList);

	UpdateShaderVariables(pd3dCommandList);

	D3D12_GPU_VIRTUAL_ADDRESS d3dcbLightsGpuVirtualAddress = m_pd3dcbLights->GetGPUVirtualAddress();
	pd3dCommandList->SetGraphicsRootConstantBufferView(2, d3dcbLightsGpuVirtualAddress); //Lights

	
	m_ObjManager->Render(pd3dCommandList, pCamera);
	//m_pSphereCollider->SphereCollider->Render(pd3dCommandList, pCamera);

}