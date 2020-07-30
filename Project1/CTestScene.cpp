#include "stdafx.h"
#include "CTestScene.h"
#include "CHeightMapTerrain.h"
#include "CSkyBox.h"
#include "CNumber.h"
#include "CUI.h"
#include "CLockOnUI.h"
#include "CAngrybotObject.h"
#include "CGunshipObject.h"
#include "CMig21.h"
#include "CTU160.h"
#include "C052CDestroyer.h"
#include "CShaderManager.h"
#include "CSphereCollider.h"
#include "CMissle.h"
#include "CMissleFog.h"
#include "CCrushSmoke.h"
#include "CWater.h"
#include "CAfterBurner.h"
#include "CCloud.h"
#include "CMissleSplash.h"
#include "CBullet.h"
#include "CMinimap.h"
#include "RedUI.h"
#include "CEngineRafraction.h"
#include "CNavigator.h"

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
	m_pLights[0].m_xmf3Position = XMFLOAT3(0, -1000.f, 0);
	m_pLights[0].m_xmf3Attenuation = XMFLOAT3(1.0f, 0.001f, 0.0001f);
	m_pLights[1].m_bEnable = true;
	m_pLights[1].m_nType = SPOT_LIGHT;
	m_pLights[1].m_fRange = 500.0f;
	m_pLights[1].m_xmf4Ambient = XMFLOAT4(0.1f, 0.1f, 0.1f, 1.0f);
	m_pLights[1].m_xmf4Diffuse = XMFLOAT4(0.4f, 0.4f, 0.4f, 1.0f);
	m_pLights[1].m_xmf4Specular = XMFLOAT4(0.3f, 0.3f, 0.3f, 0.0f);
	m_pLights[1].m_xmf3Position = XMFLOAT3(0, -1000.f, 0);
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
	m_pLights[3].m_xmf3Position = XMFLOAT3(0, -1000.f, 0);
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
	m_pLights[4].m_xmf3Position = XMFLOAT3(0, -1000.f, 0);
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

	float fx =  FRAME_BUFFER_WIDTH / 2;
	float fy =  FRAME_BUFFER_HEIGHT / 2;
	
	m_nGameObjects = 16;
	m_ppGameObjects = new CGameObject * [m_nGameObjects];
	m_ppGameObjects[0] = new CUI(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 200.f, 200.f, 0.f, XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
	m_ppGameObjects[0]->SetPosition(fx * 0.8, fy * 0.8, 0.f);

	// weapon
	m_ppGameObjects[1] = new CUI(1, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature,  160.f, 160.f, 0.f, XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
	m_ppGameObjects[1]->SetPosition(fx*0.8, -fy*0.55, 0.f);

	// time score
	m_ppGameObjects[2] = new CUI(2, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 160.f, 160.f, 0.f, XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
	m_ppGameObjects[2]->SetPosition(fx*-0.85f, fy*0.8f, 0.f);

	// speed
	m_ppGameObjects[3] = new CUI(3, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 120.f, 120.f, 0.f, XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.0f));
	m_ppGameObjects[3]->SetPosition(fx*-0.35f, fy*-0.05f, 0.f);

	// alt
	m_ppGameObjects[4] = new CUI(4, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 120.f, 120.f, 0.f, XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.0f));
	m_ppGameObjects[4]->SetPosition(fx*0.35f, fy*-0.05f, 0.f);

	m_ppGameObjects[5] = new CUI(5, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 100.f, 100.f, 0.f, XMFLOAT2(0.81f, -0.305f), XMFLOAT2(0.81f, -0.305f), XMFLOAT2(0.81f, -0.305f), XMFLOAT2(0.81f, -0.305f));
	
	// minimap point
	m_ppGameObjects[6] = new CMinimap(3, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 25.f, 25.f, 0.f, XMFLOAT2(-0.f, -0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
	m_ppGameObjects[6]->SetPosition(fx * -2.f, fy * -2.f, 0.f);

	m_ppGameObjects[7] = new CLockOnUI(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 250.f, 250.f, 0.f, XMFLOAT2(-0.f, -0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
	m_ppGameObjects[7]->SetPosition(fx * -2.f, fy * -2.f, 0.f);

	// minimap
	m_ppGameObjects[8] = new CMinimap(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 400.f, 400.f, 0.f, XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f));
	m_ppGameObjects[8]->SetPosition(fx *-0.7f, fy * -0.5f,0.f);

	// minimap red point
	m_ppGameObjects[9] = new CMinimap(4, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 25.f, 25.f, 0.f, XMFLOAT2(-0.f, -0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f), XMFLOAT2(0.f, 0.f));
	m_ppGameObjects[9]->SetPosition(fx * -2.f, fy * -2.f, 0.f);

	float scaleX = 28.f;
	float scaleY = 28.f;
	float offsetY = 5.f;
	// Speed
	m_ppGameObjects[10] = new CNumber(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, scaleX, scaleY, 0.f);
	m_ppGameObjects[10]->SetIsRender(false);
	m_ppGameObjects[10]->SetPosition(fx * -2.f, fy * -2.f, 0.f);


	m_ppGameObjects[11] = new CUI(7, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 80.f, 80.f, 0.f, XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f));
	m_ppGameObjects[11]->SetPosition(0.f, fy * -0.05f, 0.f);

	// ¿ö´×
	m_ppGameObjects[12] = new CUI(9, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 120.f, 120.f, 0.f, XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f));
	m_ppGameObjects[12]->SetIsRender(false);
	m_ppGameObjects[12]->SetPosition(0.f, fy * 0.25f, 0.f);

	// ¹Ì»çÀÏ
	m_ppGameObjects[13] = new CUI(10, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 800.f,100.f, 0.f, XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f));
	m_ppGameObjects[13]->SetIsRender(false);
	m_ppGameObjects[13]->SetPosition(fx* -0.04f, fy * 0.23f, 0.f);

	// ÆÄ±«
	m_ppGameObjects[14] = new CUI(11, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 240.f, 240.f, 0.f, XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f), XMFLOAT2(-0.f, -0.f));
	m_ppGameObjects[14]->SetIsRender(false);
	m_ppGameObjects[14]->SetPosition( fx*0.001f, fy * 0.25f, 0.f);

	m_ppGameObjects[15] = new CNavigator(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);

	m_ObjManager->AddObject(L"player_ui1_testui", m_ppGameObjects[0], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui2_weapon", m_ppGameObjects[1], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui3_time_score", m_ppGameObjects[2], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui4_speed", m_ppGameObjects[3], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui5_alt", m_ppGameObjects[4], OBJ_UI);
	//m_ObjManager->AddObject(L"player_ui6_ammo", m_ppGameObjects[5], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui7_minimap_green", m_ppGameObjects[6], OBJ_MINIMAP_PLAYER);
	m_ObjManager->AddObject(L"player_ui8_lockon", m_ppGameObjects[7], OBJ_LOCKONUI);
	m_ObjManager->AddObject(L"player_ui9_minimap", m_ppGameObjects[8], OBJ_MINIMAP_UI);
	m_ObjManager->AddObject(L"player_ui10_minimap_red", m_ppGameObjects[9], OBJ_MINIMAP_ENEMY);
	m_ObjManager->AddObject(L"player_ui11_speed_number_o", m_ppGameObjects[10], OBJ_SPEED_UI);
	m_ObjManager->AddObject(L"player_ui12_crosshair", m_ppGameObjects[11], OBJ_UI);
	m_ObjManager->AddObject(L"player_ui13_warning", m_ppGameObjects[12], OBJ_FIGHT_UI1);
	m_ObjManager->AddObject(L"player_ui14_missile", m_ppGameObjects[13], OBJ_FIGHT_UI2);
	m_ObjManager->AddObject(L"player_ui15_destroyed", m_ppGameObjects[14], OBJ_FIGHT_UI3);
	m_ObjManager->AddObject(L"player_ui16_navigator", m_ppGameObjects[15], OBJ_NAVIGATOR);

	XMFLOAT3 xmf3Scale(8.0f, 2.0f, 8.0f);
	XMFLOAT4 xmf4Color(0.0f, 0.3f, 0.0f, 0.0f);
	m_pTerrain = new CHeightMapTerrain(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, _T("Terrain/Stage1.raw"), 513, 513, xmf3Scale, xmf4Color);
	m_pTerrain->SetScale(10,10,10);

	m_pTerrain->SetPosition(-20500,-1500,-20500);
	//m_pTerrain->Rotate(0, 90, 0);
	m_ObjManager->AddObject(L"terrain", m_pTerrain, OBJ_TEST);

	CBullet* pBullet = new CBullet(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	pBullet->SetPosition(0, 0, 0);
	m_ObjManager->AddObject(L"bulletRef", pBullet, OBJ_ALLYBULLET);

	CMissle* pMissleRef = new CMissle(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, &pBullet->GetPosition(), XMFLOAT3(0, 0, 0) , m_ObjManager);
	pMissleRef->SetPosition(0, 0, 0);
	m_ObjManager->AddObject(L"missleRef", pMissleRef, OBJ_ALLYMISSLE);

	CMissleFog* pMissleFog = new CMissleFog(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 1.f, 1.f, 0.f);
	m_ObjManager->AddObject(L"MissleFog", pMissleFog, OBJ_EFFECT);

	CCrushSmoke* pCrushSmoke = new CCrushSmoke(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 1.f, 1.f, 0.f);
	m_ObjManager->AddObject(L"crushsmokeRef", pCrushSmoke, OBJ_EFFECT);

	CMissleSplash* pMissleSplashRef = new CMissleSplash(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 400.f, 400.f, 0.f);
	m_ObjManager->AddObject(L"MissleSplashRef", pMissleSplashRef, OBJ_EFFECT);

	CAfterBurner* pAfterBurner = new CAfterBurner(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 0.2f, 0.2f, 0.f);
	m_ObjManager->AddObject(L"AfterBurner", pAfterBurner, OBJ_EFFECT);

	CMig21* pMig21Ref;
	pMig21Ref = new CMig21(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	m_ObjManager->AddObject(L"mig21Ref", pMig21Ref, OBJ_REF);

	CTU160* pTu160Ref;
	pTu160Ref = new CTU160(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	m_ObjManager->AddObject(L"tu160Ref", pTu160Ref, OBJ_REF);

	C052CDestroyer* p052C;
	p052C = new C052CDestroyer(pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature);
	p052C->SetPosition(0, 0, 0);
	m_ObjManager->AddObject(L"052CRef", p052C, OBJ_REF);

	//Prepare EffectObject
	//////////////////////////////////////////////////////

	m_pWater[0] = new CWater(0, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, 64000.f, 64000.f, 0.f);
	m_pWater[0]->SetPosition(0, 145, 0);
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
	m_ObjManager->AddObject(L"WaterNormal", m_pWater[7], OBJ_MAP);

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
			pCloud[j] = new CCloud(j, pd3dDevice, pd3dCommandList, m_pd3dGraphicsRootSignature, fX, fZ, /*nInstance(dre)*/500, dre);
			pCloud[j]->m_pCloudShader = pCloudRef->m_pCloudShader;
			pCloud[j]->m_pCloudMaterial = new CMaterial(1);
			pCloud[j]->m_pCloudMaterial->SetShader(pCloudRef->m_pCloudShader);
			pCloud[j]->m_pCloudMaterial->SetTexture(pCloudRef->m_pCloudTexture[j]);
			pCloud[j]->SetMaterial(0, pCloud[j]->m_pCloudMaterial);
			pCloud[j]->SetPosition(fX,5500 ,fZ);
			m_ObjManager->AddObject(L"cloud", pCloud[j], OBJ_ALPHAMAP);
		}
	}
	CreateShaderVariables(pd3dDevice, pd3dCommandList);
	GET_MANAGER<SoundManager>()->PlayBGM(L"Stage1_BGM.mp3", CH_BGM);
}

void CTestScene::CreateStageObject()
{
	if (GET_MANAGER<SceneManager>()->m_nWaveCnt == 3)
	{
		if (GET_MANAGER<SceneManager>()->m_bStageClear == false)
		{
			GET_MANAGER<SceneManager>()->m_bStageClear = true;
		}
		return;
	}

	if (GET_MANAGER<SceneManager>()->m_bCreateShip == false)
	{
		m_bCreateShip = true;
		for (int i = 0; i < 5; ++i)
		{
			std::default_random_engine dre(time(NULL) * i * 0.548);
			std::uniform_real_distribution<float>fXPos(-7000.f, 7000.f);
			std::uniform_real_distribution<float>fZPos(3200.f, 6400.f);

			C052CDestroyer* p052C;
			p052C = new C052CDestroyer();
			p052C->SetPosition(fXPos(dre), 170, fZPos(dre));
			p052C->Rotate(0, 180, 0);
			p052C->m_xmf3Look = XMFLOAT3(0, 0, -1);
			m_ObjManager->AddObject(L"052C", p052C, OBJ_ENEMY);
		}
	}

	if (GET_MANAGER<SceneManager>()->m_nWave == GET_MANAGER<SceneManager>()->m_nWaveCnt && GET_MANAGER<SceneManager>()->m_nTgtObject == 0)
	{
		for (int i = 0; i < GET_MANAGER<SceneManager>()->m_nWaveCnt + 1; ++i)
		{
			std::default_random_engine dre(time(NULL) * i * 0.548);
			std::uniform_real_distribution<float>fXPos(-8000.f, 8000.f);
			std::uniform_real_distribution<float>fZPos(6400.f, 8500.f);
			std::uniform_real_distribution<float>fYPos(1600.f, 2200.f);
			std::uniform_real_distribution<float>fYPos_1(6500.f, 8000.f);

			CTU160* pTu160;
			pTu160 = new CTU160();
			if (GET_MANAGER<SceneManager>()->m_nWave == 0)
			{
				pTu160->SetPosition(fXPos(dre), fYPos(dre), fZPos(dre));
			}
			else
				pTu160->SetPosition(fXPos(dre), fYPos_1(dre), fZPos(dre));
			pTu160->Rotate(0, 180, 0);
			pTu160->m_xmf3Look = XMFLOAT3(0, 0, -1);
			m_ObjManager->AddObject(L"tu160", pTu160, OBJ_ENEMY);
			GET_MANAGER<SceneManager>()->m_nTgtObject++;

			CMig21* pMig21_A;
			pMig21_A = new CMig21();
			pMig21_A->SetPosition(pTu160->GetPosition().x + 200, pTu160->GetPosition().y, pTu160->GetPosition().z + 150);
			pMig21_A->Rotate(0, 180, 0);
			pMig21_A->m_xmf3Look = XMFLOAT3(0, 0, -1);
			m_ObjManager->AddObject(L"mig21A", pMig21_A, OBJ_ENEMY);
			GET_MANAGER<SceneManager>()->m_nTgtObject++;

			CMig21* pMig21_B;
			pMig21_B = new CMig21();
			pMig21_B->SetPosition(pTu160->GetPosition().x - 200, pTu160->GetPosition().y, pTu160->GetPosition().z + 150);
			pMig21_B->Rotate(0, 180, 0);
			pMig21_B->m_xmf3Look = XMFLOAT3(0, 0, -1);
			m_ObjManager->AddObject(L"mig21B", pMig21_B, OBJ_ENEMY);
			GET_MANAGER<SceneManager>()->m_nTgtObject++;
		}
		cout << GET_MANAGER<SceneManager>()->m_nTgtObject;
		GET_MANAGER<SceneManager>()->m_nWaveCnt++;
	}

	if (GET_MANAGER<SceneManager>()->m_nTgtObject == 0)
	{
		GET_MANAGER<SceneManager>()->m_nWave++;
	}
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
	m_fElapsedTime += fTimeElapsed;
	elapsedTime += fTimeElapsed;
	
	GET_MANAGER<SceneManager>()->SceneStoped();

	CreateStageObject();

	if (!GET_MANAGER<SceneManager>()->GetSceneStoped())
	{
		for (auto& obj : m_ObjManager->GetObjFromType(OBJ_ENEMY))
		{
			if (obj.second->m_bDestroyed)
			{
				m_ppGameObjects[14]->SetIsRender(true);
				elapsedTime = 0;
			}
			else if (elapsedTime > 2)
			{
				m_ppGameObjects[14]->SetIsRender(false);
			}

			if (obj.second->m_bAiLockOn == true)
			{
				m_ppGameObjects[12]->SetIsRender(true);

				if (m_fElapsedTime > 3.0)
				{
					m_ppGameObjects[12]->SetIsRender(false);
					m_fElapsedTime = 0.f;
				}
			}
			else
			{
				m_ppGameObjects[12]->SetIsRender(false);
			}

			if (m_pPlayer->m_AiMissleAssert == true)
			{
				m_ppGameObjects[13]->SetIsRender(true);
				for (auto& obj : m_ObjManager->GetObjFromType(OBJ_UI))
				{
					obj.second->m_bWarning = 1.f;
				}
				for (auto& obj : m_ObjManager->GetObjFromType(OBJ_SPEED_UI))
				{
					obj.second->m_bWarning = 1.f;
				}
			}
			else
			{
				m_ppGameObjects[13]->SetIsRender(false);
				for (auto& obj : m_ObjManager->GetObjFromType(OBJ_UI))
				{
					obj.second->m_bWarning = 0.f;
				}
				for (auto& obj : m_ObjManager->GetObjFromType(OBJ_SPEED_UI))
				{
					obj.second->m_bWarning = 0.f;
				}
			}

		}

	}

	m_ObjManager->GetObjFromTag(L"player", OBJ_PLAYER)->SetPlayerMSL(m_pPlayer->GetMSLCount());
	m_ObjManager->GetObjFromTag(L"player", OBJ_PLAYER)->SetPlayerSpeed(m_pPlayer->GetAircraftSpeed());
	m_ObjManager->Update(fTimeElapsed);
}

void CTestScene::OnPrepareRender(ID3D12GraphicsCommandList* pd3dCommandList)
{
	if (m_pd3dGraphicsRootSignature) pd3dCommandList->SetGraphicsRootSignature(m_pd3dGraphicsRootSignature);
	UpdateShaderVariables(pd3dCommandList);

	D3D12_GPU_VIRTUAL_ADDRESS d3dcbLightsGpuVirtualAddress = m_pd3dcbLights->GetGPUVirtualAddress();
	pd3dCommandList->SetGraphicsRootConstantBufferView(2, d3dcbLightsGpuVirtualAddress); //Lights
}

void CTestScene::OnPreRender(ID3D12Device* pd3dDevice, ID3D12CommandQueue* pd3dCommandQueue, ID3D12Fence* pd3dFence, HANDLE hFenceEvent)
{
	if(m_ObjManager->GetObjFromTag(L"EngineRefractionObj", OBJ_EFFECT))
		m_ObjManager->GetObjFromTag(L"EngineRefractionObj", OBJ_EFFECT)->OnPreRender(pd3dDevice, pd3dCommandQueue, pd3dFence, hFenceEvent);
}

void CTestScene::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera, bool bPreRender, ID3D12Resource* pCurrentBackBuffer)
{
	
	//if (m_pd3dGraphicsRootSignature) pd3dCommandList->SetGraphicsRootSignature(m_pd3dGraphicsRootSignature);
	if (m_pd3dComputeRootSignature) pd3dCommandList->SetComputeRootSignature(m_pd3dComputeRootSignature);

	if (m_pd3dCbvSrvDescriptorHeap) pd3dCommandList->SetDescriptorHeaps(1, &m_pd3dCbvSrvDescriptorHeap);

	pCamera->SetViewportsAndScissorRects(pd3dCommandList);
	pCamera->UpdateShaderVariables(pd3dCommandList);

	UpdateShaderVariables(pd3dCommandList);

	//D3D12_GPU_VIRTUAL_ADDRESS d3dcbLightsGpuVirtualAddress = m_pd3dcbLights->GetGPUVirtualAddress();
	//pd3dCommandList->SetGraphicsRootConstantBufferView(2, d3dcbLightsGpuVirtualAddress); //Lights
	
	m_ObjManager->Render(pd3dCommandList, pCamera, bPreRender);
	//m_pSphereCollider->SphereCollider->Render(pd3dCommandList, pCamera);

	if (m_bCreateEngineRefraction == true)
	{
		m_bCreateEngineRefraction = false;
		CEngineRafraction* testRafraction;
		testRafraction = new CEngineRafraction(0, GET_MANAGER<CDeviceManager>()->GetDevice(), pd3dCommandList, m_pd3dGraphicsRootSignature, 1.f, 2.f, 0.f);
		testRafraction->SetPosition(0, 1000, 2000);
		//testRafraction->SetScale(400, 400, 400);
		m_ObjManager->AddObject(L"EngineRefractionObj", testRafraction, OBJ_EFFECT);
	}
}