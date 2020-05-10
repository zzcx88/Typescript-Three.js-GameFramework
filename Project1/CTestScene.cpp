#include "stdafx.h"
#include "CTestScene.h"
#include "CHeightMapTerrain.h"
#include "CSkyBox.h"
#include "CUI.h"
#include "CLockOnUI.h"
#include "CAngrybotObject.h"
#include "CGunshipObject.h"
#include "CSuperCobraObject.h"
#include "CShaderManager.h"
#include "CSphereCollider.h"
#include "CMissle.h"
#include "CMissleFog.h"
#include "CWater.h"
#include "CAfterBurner.h"
#include "CCloud.h"
#include "CMissleSplash.h"
#include "CBullet.h"

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

	float fx = 0.5f /0.96f;
	float fy = 0.5f / 0.54f;

	m_nGameObjects = 10;

	m_nGameObjects = 10;
	m_ppGameObjects = new CGameObject * [m_nGameObjects];
	m_ppGameObjects[0] = new CUI(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.2f, 0.3f, 0.f, XMFLOAT2(0.5f, 0.5f), XMFLOAT2(0.5f, 0.5f), XMFLOAT2(0.5f, 0.5f), XMFLOAT2(0.5f, 0.5f));
	m_ppGameObjects[1] = new CUI(1, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.2f, 0.35f, 0.f, XMFLOAT2(0.725f, -0.45f), XMFLOAT2(0.725f, -0.45f), XMFLOAT2(0.725f, -0.45f), XMFLOAT2(0.725f, -0.45f));
	m_ppGameObjects[2] = new CUI(2, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.15f, 0.25f, 0.f, XMFLOAT2(-0.875f, 0.8f), XMFLOAT2(-0.875f, 0.8f), XMFLOAT2(-0.875f, 0.8f), XMFLOAT2(-0.875f, 0.8f));
	m_ppGameObjects[3] = new CUI(3, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.125f, 0.2f, 0.f, XMFLOAT2(-0.25f, 0.f), XMFLOAT2(-0.25f, 0.f), XMFLOAT2(-0.25f, 0.f), XMFLOAT2(-0.25f, 0.0f));
	m_ppGameObjects[4] = new CUI(4, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.125f, 0.2f, 0.f, XMFLOAT2(0.25f, 0.f), XMFLOAT2(0.25f, 0.f), XMFLOAT2(0.25f, 0.f), XMFLOAT2(0.25f, 0.0f));
	m_ppGameObjects[5] = new CUI(5, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.1f, 0.3f, 0.f, XMFLOAT2(0.81f, -0.305f), XMFLOAT2(0.81f, -0.305f), XMFLOAT2(0.81f, -0.305f), XMFLOAT2(0.81f, -0.305f));
	
	m_ppGameObjects[6] = new CUI(7, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.3f / 9.6f, 0.3f / 5.4f, 0.f, XMFLOAT2(-0.f, -0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
	m_ppGameObjects[6]->SetPosition(-2.f, -2.f, 0.f);
	
	m_ppGameObjects[7] = new CLockOnUI(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 100.f / 960.f, 100.f / 540.f, 0.f, XMFLOAT2(-0.f, -0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
	m_ppGameObjects[7]->SetPosition(-2.f, -2.f, 0.f);

	m_ppGameObjects[8] = new CUI(6, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, fx, fy, 0.f, XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f));
	m_ppGameObjects[8]->SetPosition(-0.75f, -0.5f, 0.f);
	m_ppGameObjects[9] = new CUI(8, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.3f / 9.6f, 0.3f / 5.4f, 0.f, XMFLOAT2(-0.f, -0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
	m_ppGameObjects[9]->SetPosition(-2.f, -2.f, 0.f);

	m_ObjManager->AddObject(L"player_ui1_testui", m_ppGameObjects[0], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui2_weapon", m_ppGameObjects[1], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui3_time_score", m_ppGameObjects[2], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui4_speed", m_ppGameObjects[3], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui5_alt", m_ppGameObjects[4], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui6_ammo", m_ppGameObjects[5], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui7_minimap_green", m_ppGameObjects[6], OBJ_MINIMAP_PLAYER);
	m_ObjManager->AddObject(L"player_ui8_lockon", m_ppGameObjects[7], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui9_minimap", m_ppGameObjects[8], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui10_minimap_red", m_ppGameObjects[9], OBJ_MINIMAP_ENEMY);

	/*XMFLOAT3 xmf3Scale(8.0f, 2.0f, 8.0f);
	XMFLOAT4 xmf4Color(0.0f, 0.3f, 0.0f, 0.0f);
	m_pTerrain = new CHeightMapTerrain(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, _T("Terrain/HeightMap.raw"), 257, 257, xmf3Scale, xmf4Color);
	m_ObjManager->AddObject(L"terrain", m_pTerrain, OBJ_MAP);*/

	/*m_nHierarchicalGameObjects = 0;
	m_ppHierarchicalGameObjects = new CGameObject * [m_nHierarchicalGameObjects];

	CLoadedModelInfo* pAngrybotModel = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, "Model/Angrybot.bin", NULL, MODEL_ANI);
	CLoadedModelInfo* pWaterModel = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, "Model/water.bin", NULL, MODEL_STD);
	
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
	m_ppHierarchicalGameObjects[2]->SetChild(p052C->m_pModelRootObject);
	m_ppHierarchicalGameObjects[2]->SetScale(50,50,50);
	m_ppHierarchicalGameObjects[2]->SetPosition(410, 200, -5000);

	m_ppHierarchicalGameObjects[3] = new CGunshipObject(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	m_ppHierarchicalGameObjects[3]->SetChild(pMissle->m_pModelRootObject);
	m_ppHierarchicalGameObjects[3]->SetPosition(410, 800, -5000);
	m_ppHierarchicalGameObjects[3]->SetScale(50, 50, 50);*/

	/*m_ObjManager->AddObject(L"enemy", m_ppHierarchicalGameObjects[0], OBJ_TEST);
	m_ObjManager->AddObject(L"enemy", m_ppHierarchicalGameObjects[1], OBJ_TEST);
	m_ObjManager->AddObject(L"destroyer", m_ppHierarchicalGameObjects[3], OBJ_TEST);
	m_ObjManager->AddObject(L"Sphere", m_ppHierarchicalGameObjects[4], OBJ_TEST);*/

	/*CLoadedModelInfo* p052C = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, "Model/052C.bin", NULL, MODEL_STD);*/

	CSuperCobraObject* pSphereCollider;
	pSphereCollider = new CSuperCobraObject(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	//pSphereCollider->SetChild(p052C->m_pModelRootObject);
	pSphereCollider->SetPosition(410, 1000, -3000);
	pSphereCollider->SetScale(10,10,10);
	m_ObjManager->AddObject(L"SphereCollider", pSphereCollider, OBJ_ENEMY);

	CSuperCobraObject* pSphereCollider2;
	pSphereCollider2 = new CSuperCobraObject(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	//pSphereCollider2->SetChild(p052C->m_pModelRootObject);
	pSphereCollider2->SetPosition(110, 1000, -3000);
	pSphereCollider2->SetScale(10, 10, 10);
	m_ObjManager->AddObject(L"SphereCollider2", pSphereCollider2, OBJ_ENEMY);

	CSuperCobraObject* pSphereCollider3;
	pSphereCollider3 = new CSuperCobraObject(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	//pSphereCollider3->SetChild(p052C->m_pModelRootObject);
	pSphereCollider3->SetPosition(310, 1000, -3000);
	pSphereCollider3->SetScale(10, 10, 10);
	m_ObjManager->AddObject(L"SphereCollider3", pSphereCollider3, OBJ_ENEMY);

	CSuperCobraObject* pSphereCollider4;
	pSphereCollider4 = new CSuperCobraObject(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	//pSphereCollider4->SetChild(p052C->m_pModelRootObject);
	pSphereCollider4->SetPosition(510, 1000, -3000);
	pSphereCollider4->SetScale(10, 10, 10);
	m_ObjManager->AddObject(L"SphereCollider4", pSphereCollider4, OBJ_ENEMY);

	CSuperCobraObject* pSphereCollider5;
	pSphereCollider5 = new CSuperCobraObject(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	//pSphereCollider5->SetChild(p052C->m_pModelRootObject);
	pSphereCollider5->SetPosition(210, 1000, -3000);
	pSphereCollider5->SetScale(10, 10, 10);
	m_ObjManager->AddObject(L"SphereCollider5", pSphereCollider5, OBJ_ENEMY);

	//Prepare EffectObject
	//////////////////////////////////////////////////////
	m_pMissleFog = new CMissleFog(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 4.f, 4.f, 0.f);
	m_pMissleFog->m_bRefference = true;
	m_ObjManager->AddObject(L"MissleFog", m_pMissleFog, OBJ_EFFECT);

	m_pAfterBurner = new CAfterBurner(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.2f, 0.2f, 0.f);
	m_pAfterBurner->m_bRefference = true;
	m_ObjManager->AddObject(L"AfterBurner", m_pAfterBurner, OBJ_EFFECT);

	m_pWater[0] = new CWater(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[0]->SetPosition(0, 140, 0);
	m_pWater[0]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterBase", m_pWater[0], OBJ_ALPHAMAP);

	m_pWater[1] = new CWater(1, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[1]->SetPosition(0, 155, 0);
	m_pWater[1]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterNormal", m_pWater[1], OBJ_MAP);

	m_pWater[2] = new CWater(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[2]->SetPosition(64000.f, 140, 0);
	m_pWater[2]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterBase", m_pWater[2], OBJ_ALPHAMAP);

	m_pWater[3] = new CWater(1, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[3]->SetPosition(64000.f, 155, 0);
	m_pWater[3]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterNormal", m_pWater[3], OBJ_MAP);

	m_pWater[4] = new CWater(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[4]->SetPosition(-64000.f, 140, 0);
	m_pWater[4]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterBase", m_pWater[4], OBJ_ALPHAMAP);

	m_pWater[5] = new CWater(1, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[5]->SetPosition(-64000.f, 155, 0);
	m_pWater[5]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterNormal", m_pWater[5], OBJ_MAP);

	m_pWater[6] = new CWater(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[6]->SetPosition(-64000.f, 140, -64000.f);
	m_pWater[6]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterBase", m_pWater[6], OBJ_ALPHAMAP);

	m_pWater[7] = new CWater(1, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[7]->SetPosition(-64000.f, 155, -64000.f);
	m_pWater[7]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterBase", m_pWater[7], OBJ_ALPHAMAP);

	m_pWater[8] = new CWater(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[8]->SetPosition(64000.f, 140, 64000.f);
	m_pWater[8]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterBase", m_pWater[8], OBJ_ALPHAMAP);

	m_pWater[9] = new CWater(1, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[9]->SetPosition(64000.f, 155, 64000.f);
	m_pWater[9]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterNormal", m_pWater[9], OBJ_MAP);

	m_pWater[10] = new CWater(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[10]->SetPosition(0, 140, 64000.f);
	m_pWater[10]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterBase", m_pWater[10], OBJ_ALPHAMAP);

	m_pWater[11] = new CWater(1, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[11]->SetPosition(0, 155, 64000.f);
	m_pWater[11]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterNormal", m_pWater[11], OBJ_MAP);

	m_pWater[12] = new CWater(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[12]->SetPosition(0, 140, -64000.f);
	m_pWater[12]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterBase", m_pWater[12], OBJ_ALPHAMAP);

	m_pWater[13] = new CWater(1, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[13]->SetPosition(0, 155, -64000.f);
	m_pWater[13]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterNormal", m_pWater[13], OBJ_MAP);

	m_pWater[14] = new CWater(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[14]->SetPosition(64000.f, 140, -64000.f);
	m_pWater[14]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterBase", m_pWater[14], OBJ_ALPHAMAP);

	m_pWater[15] = new CWater(1, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[15]->SetPosition(64000.f, 155, -64000.f);
	m_pWater[15]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterNormal", m_pWater[15], OBJ_MAP);

	m_pWater[16] = new CWater(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[16]->SetPosition(-64000.f, 140, 64000.f);
	m_pWater[16]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterBase", m_pWater[16], OBJ_ALPHAMAP);

	m_pWater[17] = new CWater(1, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[17]->SetPosition(-64000.f, 155, 64000.f);
	m_pWater[17]->Rotate(90, 0, 0);
	m_ObjManager->AddObject(L"WaterNormal", m_pWater[17], OBJ_MAP);

	CCloud* pCloudRef;
	pCloudRef = new CCloud(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);

	CCloud* pCloud[8];

	for(int i = 0; i < 50; ++i)
	{
		std::default_random_engine dre(time(NULL) * i * 151636);
		std::uniform_real_distribution<float>fXPos(-64000.f, 64000.f);
		std::uniform_real_distribution<float>fZPos(-64000.f, 64000.f);
		std::uniform_int_distribution<int>nInstance(900, 1000);
		
		for (int j = 0; j < 8; ++j)
		{
			float fX = fXPos(dre);
			float fZ = fZPos(dre);
			pCloud[j] = new CCloud(j, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, fX, fZ, nInstance(dre), dre);
			pCloud[j]->m_pCloudShader = pCloudRef->m_pCloudShader;
			pCloud[j]->m_pCloudMaterial = new CMaterial(1);
			pCloud[j]->m_pCloudMaterial->SetShader(pCloudRef->m_pCloudShader);
			pCloud[j]->m_pCloudMaterial->SetTexture(pCloudRef->m_pCloudTexture[j]);
			pCloud[j]->SetMaterial(0, pCloud[j]->m_pCloudMaterial);
			m_ObjManager->AddObject(L"cloud", pCloud[j], OBJ_ALPHAMAP);
		}
	}

	CMissleSplash* pMissleSplashRef = new CMissleSplash(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 400.f, 400.f, 0.f);
	m_ObjManager->AddObject(L"MissleSplashRef", pMissleSplashRef, OBJ_EFFECT);

	CBullet* pBullet = new CBullet(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	pBullet->SetPosition(0,0,0);
	//pBullet->SetScale(100,100,100);
	m_ObjManager->AddObject(L"bulletRef", pBullet, OBJ_BULLET);


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

	/*if (m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->SphereCollider->m_BoundingSphere.Center.z != 0)

	{
		if (m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->SphereCollider->m_BoundingSphere.Intersects(m_pPlayer->SphereCollider->m_BoundingSphere))
		{
			cout << "Player : " << m_pPlayer->SphereCollider->m_BoundingSphere.Center.z << ", Sphere : " << m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->SphereCollider->m_BoundingSphere.Center.z << endl;
		}

	}*/

	if (m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY))
	{
		m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->Rotate(0, 0.1, 0);
		m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->MoveForward(200 * fTimeElapsed);
	}

	/*if (m_ObjManager->GetObjFromTag(L"SphereCollider2", OBJ_ENEMY))
	{
		m_ObjManager->GetObjFromTag(L"SphereCollider2", OBJ_ENEMY)->Rotate(0, 0, 0);
		m_ObjManager->GetObjFromTag(L"SphereCollider2", OBJ_ENEMY)->MoveForward(300 * fTimeElapsed);
	}

	if (m_ObjManager->GetObjFromTag(L"SphereCollider3", OBJ_ENEMY))
	{
		m_ObjManager->GetObjFromTag(L"SphereCollider3", OBJ_ENEMY)->Rotate(0, -0.1, 0);
		m_ObjManager->GetObjFromTag(L"SphereCollider3", OBJ_ENEMY)->MoveForward(400 * fTimeElapsed);
	}
	if (m_ObjManager->GetObjFromTag(L"SphereCollider4", OBJ_ENEMY))
	{
		m_ObjManager->GetObjFromTag(L"SphereCollider4", OBJ_ENEMY)->Rotate(0, 0.1, 0);
		m_ObjManager->GetObjFromTag(L"SphereCollider4", OBJ_ENEMY)->MoveForward(500 * fTimeElapsed);
	}
	if (m_ObjManager->GetObjFromTag(L"SphereCollider5", OBJ_ENEMY))
	{
		m_ObjManager->GetObjFromTag(L"SphereCollider5", OBJ_ENEMY)->Rotate(0, -0.1, 0);
		m_ObjManager->GetObjFromTag(L"SphereCollider5", OBJ_ENEMY)->MoveForward(600 * fTimeElapsed);
	}*/

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

	/*m_pLockOn->Render(GetScreenPos(XMFLOAT3(m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->GetPosition().x, m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->GetPosition().y, m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->GetPosition().z), pCamera),
		m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->GetPosition(),
		m_pPlayer->GetPosition(), m_pPlayer->GetLookVector(),
		m_ppGameObjects[7]);*/

	//m_pUI->MoveMinimapPoint(m_pPlayer->GetPosition(), m_ppGameObjects[6]);
	//m_pUI->MoveMinimapPoint(m_ObjManager->GetObjFromTag(L"SphereCollider", OBJ_ENEMY)->GetPosition(), m_ppGameObjects[9]);

	//m_ObjManager->MoveMinimapPoint();

	m_ObjManager->Render(pd3dCommandList, pCamera);
	//m_pSphereCollider->SphereCollider->Render(pd3dCommandList, pCamera);

}