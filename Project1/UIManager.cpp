#include "stdafx.h"
#include "UIManager.h"
#include "CGameObject.h"
#include "CUI.h"
#include "CNumber.h"
#include "CLockOnUI.h"

UIManager::UIManager()
{
	numObjects = 24;
	ppNumObjects = new CGameObject * [numObjects];
	speed.reserve(4);
	alt.reserve(5);
	missile.reserve(3);
	timeS.reserve(2);
	timeM.reserve(2);
	timeH.reserve(2);
	score.reserve(6);
	GameOBJs.reserve(50);

	for (int i = 0; i< 24; ++i)
	{
		CNumber* pnum;
		pnum = new CNumber();
		pnum->SetMesh((CMesh*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_pUIPlaneMesh);
		for (int j = 0; j < GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_nNumTex; ++j)
			pnum->m_ppUITexture[j] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[j];
		pnum->m_pUIMaterial = new CMaterial(1);
		pnum->m_pUIMaterial->SetTexture(pnum->m_ppUITexture[0]);
		pnum->m_pUIMaterial->SetShader(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_pUIShader);
		pnum->SetMaterial(0, pnum->m_pUIMaterial);
		if (i < 4)
			pnum->SetPosition(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui4_speed", OBJ_UI)->GetPosition().x - 25.f + 14.f * i,
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui4_speed", OBJ_UI)->GetPosition().y - 5.f, 0.f);
		if (4 <= i && i < 9)
			pnum->SetPosition(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui5_alt", OBJ_UI)->GetPosition().x -40.f + 14.f * (i-3),
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui5_alt", OBJ_UI)->GetPosition().y - 5.f, 0.f);
		if (9 <= i && i < 12)
			pnum->SetPosition(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui2_weapon", OBJ_UI)->GetPosition().x + 25.f + 14.f * (i-8),
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui2_weapon", OBJ_UI)->GetPosition().y +30.f, 0.f);
		if (12 <= i && i < 14)
			pnum->SetPosition(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui3_time_score", OBJ_UI)->GetPosition().x + 35.f + 14.f * (i-11),
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui3_time_score", OBJ_UI)->GetPosition().y + 30.f, 0.f);
		if (14 <= i && i < 16)
			pnum->SetPosition(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui3_time_score", OBJ_UI)->GetPosition().x + 70.f + 14.f * (i - 13),
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui3_time_score", OBJ_UI)->GetPosition().y + 30.f, 0.f);
		if (16 <= i && i < 18)
			pnum->SetPosition(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui3_time_score", OBJ_UI)->GetPosition().x + 105.f + 14.f * (i - 15),
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui3_time_score", OBJ_UI)->GetPosition().y + 30.f, 0.f);
		if (18 <= i && i < 24)
			pnum->SetPosition(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui3_time_score", OBJ_UI)->GetPosition().x + 35.f + 14.f * (i-17),
				GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui3_time_score", OBJ_UI)->GetPosition().y, 0.f);

			GET_MANAGER<ObjectManager>()->AddObject(L"NumInstance", pnum, OBJ_SPEED_UI);
		pnum->SetIsRender(true);
		ppNumObjects[i] = pnum;
	}
}

UIManager::~UIManager()
{
}

void UIManager::MoveMinimapPoint(ObjectManager::MAPOBJ* PlyList, ObjectManager::MAPOBJ* EneList)
{

	if (PlyList->begin()->second->m_pUI == NULL)
	{
		CUI* pUI;
		pUI = new CUI();
		pUI->SetMesh((CMesh*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui7_minimap_green", OBJ_MINIMAP_PLAYER)->m_pUIPlaneMesh);
		pUI->m_ppUITexture[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui7_minimap_green", OBJ_MINIMAP_PLAYER)->m_ppUITexture[7];
		pUI->m_pUIMaterial = new CMaterial(1);
		pUI->m_pUIMaterial->SetTexture(pUI->m_ppUITexture[0]);
		pUI->m_pUIMaterial->SetShader(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui7_minimap_green", OBJ_MINIMAP_PLAYER)->m_pUIShader);
		pUI->SetMaterial(0, pUI->m_pUIMaterial);
		GET_MANAGER<ObjectManager>()->AddObject(L"MinimapInstance", pUI, OBJ_MINIMAP_PLAYER);
		PlyList->begin()->second->m_pUI = pUI;
	}
	else
	{
		PlyList->begin()->second->m_pUI->MoveMinimapPoint(PlyList->begin()->second->GetPosition(), PlyList->begin()->second->m_pUI);
	}

	//공중 오브젝트 적은 묶어서 한번에
	for (auto& Ene : *EneList)
	{
		if (Ene.second->m_pUI == NULL)
		{
			CUI* pUI;
			pUI = new CUI();
			pUI->SetMesh((CMesh*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui10_minimap_red", OBJ_MINIMAP_ENEMY)->m_pUIPlaneMesh);
			pUI->m_ppUITexture[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui10_minimap_red", OBJ_MINIMAP_ENEMY)->m_ppUITexture[8];
			pUI->m_pUIMaterial = new CMaterial(1);
			pUI->m_pUIMaterial->SetTexture(pUI->m_ppUITexture[0]);
			pUI->m_pUIMaterial->SetShader(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui10_minimap_red", OBJ_MINIMAP_ENEMY)->m_pUIShader);
			pUI->SetMaterial(0, pUI->m_pUIMaterial);
			GET_MANAGER<ObjectManager>()->AddObject(L"MinimapInstance", pUI, OBJ_MINIMAP_ENEMY);

			Ene.second->m_pUI = pUI;
		}
		Ene.second->m_pUI->MoveMinimapPoint(Ene.second->GetPosition(), Ene.second->m_pUI);
	}

	//지상 오브젝트 적도 묶어서 한번에



	//공중 오브젝트 아군도 묶어서 한번에



	//지상 오브젝트 아군도 묶어서 한번에
}

void UIManager::MoveLockOnUI(ObjectManager::MAPOBJ* PlyList, ObjectManager::MAPOBJ* EneList)
{
	for (auto& Ene : *EneList)
	{
		if (Ene.second->m_pLockOnUI == NULL)
		{
			CLockOnUI* pLockOnUI;
			pLockOnUI = new CLockOnUI();
			pLockOnUI->SetMesh((CMesh*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui8_lockon", OBJ_LOCKONUI)->m_pLockOnUIPlaneMesh);
			pLockOnUI->m_ppLockOnUITexture[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui8_lockon", OBJ_LOCKONUI)->m_ppLockOnUITexture[0];
			pLockOnUI->m_pLockOnUIMaterial = new CMaterial(1);
			pLockOnUI->m_pLockOnUIMaterial->SetTexture(pLockOnUI->m_ppLockOnUITexture[0]);
			pLockOnUI->m_pLockOnUIMaterial->SetShader(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui8_lockon", OBJ_LOCKONUI)->m_pLockOnUIShader);
			pLockOnUI->SetMaterial(0, pLockOnUI->m_pLockOnUIMaterial);
			GET_MANAGER<ObjectManager>()->AddObject(L"LockOnInstance", pLockOnUI, OBJ_LOCKONUI);

			Ene.second->m_pLockOnUI = pLockOnUI;
			GameOBJs.emplace_back(Ene.second);
			sort(begin(GameOBJs), end(GameOBJs), [](const CGameObject* a, const CGameObject* b) {
				return a->m_xmf4x4World._41 < b->m_xmf4x4World._41;
				});
		}

		Ene.second->m_pLockOnUI->MoveLockOnUI(Ene.second->GetScreenPosition(), Ene.second->GetPosition(),
			PlyList->begin()->second->GetPosition(), PlyList->begin()->second->GetLook(), Ene.second->m_pLockOnUI, PlyList->begin()->second->m_pCamera);

		if (Ene.second->m_pLockOnUI->bDetectable == true)
		{
			
			//cout << Ene.second->m_pLockOnUI->GetState() << ", " << Ene.second->GetState() << endl;
			if(Ene.second->m_bAiming == true&&Ene.second->GetState() != true)
			{ 
				if (Ene.second->number == NULL)
				{
					CNumber* pnum;
					pnum = new CNumber();
					pnum->SetMesh((CMesh*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_pUIPlaneMesh);
					pnum->m_ppUITexture[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[0];
					pnum->m_pUIMaterial = new CMaterial(1);
					pnum->m_pUIMaterial->SetTexture(pnum->m_ppUITexture[0]);
					pnum->m_pUIMaterial->SetShader(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_pUIShader);
					pnum->SetMaterial(0, pnum->m_pUIMaterial);
					pnum->SetScale(0.6f, 0.6f,0.f);
					GET_MANAGER<ObjectManager>()->AddObject(L"NumInstance", pnum, OBJ_SPEED_UI);

					Ene.second->number = pnum;
				}
				if (Ene.second->m_pLockOnUI->bLockOn == true)
				{
					Ene.second->m_pLockOnUI->m_nTextureRender = 0;
					Ene.second->m_pLockOnUI->m_pLockOnUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()
						->GetObjFromTag(L"player_ui8_lockon", OBJ_LOCKONUI)->m_ppLockOnUITexture[1];

					float fx = Ene.second->GetScreenPosition().x - ((float)FRAME_BUFFER_WIDTH / 2.f);
					float fy = (Ene.second->GetScreenPosition().y - ((float)FRAME_BUFFER_HEIGHT / 2.f)) * -1;

					Ene.second->number->SetPosition(fx-20.f, fy+8.f, 0.f);

					Ene.second->m_bCanFire = true;
				}
				else
				{
					Ene.second->m_pLockOnUI->m_pLockOnUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()
						->GetObjFromTag(L"player_ui8_lockon", OBJ_LOCKONUI)->m_ppLockOnUITexture[0];
					Ene.second->m_pLockOnUI->TextureAnimate();

					Ene.second->number->SetPosition(-20000.f, -20000.f, 0.f);

					Ene.second->m_bCanFire = false;
				}
			}
			else
			{
				Ene.second->m_pLockOnUI->m_nTextureRender = 0;
				Ene.second->m_pLockOnUI->m_pLockOnUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()
					->GetObjFromTag(L"player_ui8_lockon", OBJ_LOCKONUI)->m_ppLockOnUITexture[0];
			}

		}
		else
		{
			Ene.second->m_bAiming = false;
			Ene.second->m_pLockOnUI->m_pLockOnUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()
				->GetObjFromTag(L"player_ui8_lockon", OBJ_LOCKONUI)->m_ppLockOnUITexture[0];
		}

	}

	for (auto p = GameOBJs.begin(); p != GameOBJs.end(); ++p)
	{
		if (*p != NULL)
		{
			if ((*p)->GetState() != true)
			{
				if (p == GameOBJs.begin() + Count)
					(*p)->m_bAiming = true;
				else
				{
					(*p)->m_bAiming = false;
					(*p)->m_bCanFire = false;
				}
			}
			else
			{
				if (GameOBJs.size() != 1)
				{
					p = GameOBJs.erase(p);
					Count = 0;
					p = GameOBJs.begin() + Count;
					cout << GameOBJs.capacity();
				}
				else
				{
					GameOBJs.clear();
					p = GameOBJs.end();
					break;
				}
				sort(begin(GameOBJs), end(GameOBJs), [](const CGameObject* a, const CGameObject* b) {
					return a->m_xmf4x4World._41 < b->m_xmf4x4World._41;
					});
			}
		}
	}

	

	KeyManager* keyManager = GET_MANAGER<KeyManager>();
	DWORD dwDirection = 0;

	if (true == keyManager->GetKeyState(STATE_DOWN, VK_F))
	{
		dwDirection |= VK_F;
		Count++;
		if (GameOBJs.size() <= Count)
			Count = 0;
	}


	//GameOBJs.clear();
}


void UIManager::NumberTextureAnimate(ObjectManager::MAPOBJ* PlyList, const float& TimeDelta)
{
	fElapsedTime -= TimeDelta;

	if (fElapsedTime <= 0.f)
	{
		fElapsedTime = 60.f;
		n_Minute -= 1;
		if (n_Minute <= 0)
		{
			if(n_Hour != 0)
				n_Hour -= 1;

			n_Minute = 59;
		}
	}

	speed_number = (int)1800.f / 1000.f * PlyList->begin()->second->GetPlayerSpeed();
	alt_number = fabs((int)PlyList->begin()->second->GetPosition().y-200);
	missile_number = PlyList->begin()->second->GetPlayerMSL();
	score_number = PlyList->begin()->second->GetScore();
	nSecond = (int)fElapsedTime;
	nMinute = n_Minute;
	nHour = n_Hour;


	//cout << n_Minute << endl;

	while (speed_number != 0) {
		speed.emplace_back(speed_number % 10);
		speed_number /= 10;
	}
	while (alt_number != 0) {
		alt.emplace_back(alt_number % 10);
		alt_number /= 10;
	}
	while (missile_number != 0) {
		missile.emplace_back(missile_number % 10);
		missile_number /= 10;
	}
	while (nSecond != 0) {
		timeS.emplace_back(nSecond % 10);
		nSecond /=10;
	}
	while (nMinute != 0) {
		timeM.emplace_back(nMinute % 10);
		nMinute /= 10;
	}
	while (nHour != 0) {
		timeH.emplace_back(nHour % 10);
		nHour /= 10;
	} 
	while (score_number != 0) {
		score.emplace_back(score_number % 10);
		score_number /= 10;
	}

	// Font animation(speed)
	if (speed.size() > 0)
	{
		ppNumObjects[0]->SetIsRender(true);
		ppNumObjects[1]->SetIsRender(false);
		ppNumObjects[2]->SetIsRender(false);
		ppNumObjects[3]->SetIsRender(false);
		ppNumObjects[0]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[speed[0]];
	}
	if (speed.size() > 1)
	{
		ppNumObjects[1]->SetIsRender(true);
		ppNumObjects[0]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[speed[1]];
		ppNumObjects[1]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[speed[0]];
	}
	if (speed.size() > 2)
	{
		ppNumObjects[2]->SetIsRender(true);
		ppNumObjects[0]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[speed[2]];
		ppNumObjects[1]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[speed[1]];
		ppNumObjects[2]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[speed[0]];
	}
	if (speed.size() > 3)
	{
		ppNumObjects[3]->SetIsRender(true);
		ppNumObjects[0]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[speed[3]];
		ppNumObjects[1]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[speed[2]];
		ppNumObjects[2]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[speed[1]];
		ppNumObjects[3]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[speed[0]];
	}

	// Font animation(alt)
	if (alt.size() > 0)
	{
		ppNumObjects[4]->SetIsRender(false);
		ppNumObjects[5]->SetIsRender(false);
		ppNumObjects[6]->SetIsRender(false);
		ppNumObjects[7]->SetIsRender(false);
		ppNumObjects[8]->SetIsRender(true);

		ppNumObjects[8]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[0]];
	}
	if (alt.size() > 1)
	{
		ppNumObjects[7]->SetIsRender(true);
		ppNumObjects[8]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[0]];
		ppNumObjects[7]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[1]];
	}
	if (alt.size() > 2)
	{
		ppNumObjects[6]->SetIsRender(true);
		ppNumObjects[8]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[0]];
		ppNumObjects[7]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[1]];
		ppNumObjects[6]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[2]];
	}
	if (alt.size() > 3)
	{
		ppNumObjects[5]->SetIsRender(true);
		ppNumObjects[8]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[0]];
		ppNumObjects[7]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[1]];
		ppNumObjects[6]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[2]];
		ppNumObjects[5]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[3]];
	}
	if (alt.size() > 4)
	{
		ppNumObjects[4]->SetIsRender(true);

		ppNumObjects[8]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[0]];
		ppNumObjects[7]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[1]];
		ppNumObjects[6]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[2]];
		ppNumObjects[5]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[3]];
		ppNumObjects[4]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[alt[4]];
	}

	// Font animation(missile)
	if (missile.size() > 0)
	{
		ppNumObjects[9]->SetIsRender(false);
		ppNumObjects[10]->SetIsRender(false);
		ppNumObjects[11]->SetIsRender(true);

		ppNumObjects[11]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[missile[0]];
	}
	if (missile.size() > 1)
	{
		ppNumObjects[10]->SetIsRender(true);
		ppNumObjects[10]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[missile[1]];
		ppNumObjects[11]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[missile[0]];
	}
	if (missile.size() > 2)
	{
		ppNumObjects[9]->SetIsRender(true);
		ppNumObjects[9]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[missile[2]];
		ppNumObjects[10]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[missile[1]];
		ppNumObjects[11]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[missile[0]];
	}
	
	// Font animation(time hour)
	if (timeH.size() > 0)
	{
		ppNumObjects[12]->SetIsRender(true);
		ppNumObjects[13]->SetIsRender(true);

		ppNumObjects[13]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[timeH[0]];
	}
	if (timeH.size() > 1)
	{
		ppNumObjects[12]->SetIsRender(true);
		ppNumObjects[12]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[timeH[1]];
		ppNumObjects[13]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[timeH[0]];
	}

	// Font animation(time min)
	if (timeM.size() > 0)
	{
		ppNumObjects[14]->SetIsRender(true);
		ppNumObjects[15]->SetIsRender(true);

		ppNumObjects[15]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[timeM[0]];
	}
	if (timeM.size() > 1)
	{
		ppNumObjects[14]->SetIsRender(true);
		ppNumObjects[14]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[timeM[1]];
		ppNumObjects[15]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[timeM[0]];
	}	

	// Font animation(time sec)
	if (timeS.size() > 0)
	{
		ppNumObjects[16]->SetIsRender(true);
		ppNumObjects[17]->SetIsRender(true);

		ppNumObjects[17]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[timeS[0]];
	}
	if (timeS.size() > 1)
	{
		ppNumObjects[16]->SetIsRender(true);
		ppNumObjects[16]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[timeS[1]];
		ppNumObjects[17]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[timeS[0]];
	}

	// Font animation(score)
	if (score.size() > 0)
	{
		ppNumObjects[18]->SetIsRender(false);
		ppNumObjects[19]->SetIsRender(false);
		ppNumObjects[20]->SetIsRender(false);
		ppNumObjects[21]->SetIsRender(false);
		ppNumObjects[22]->SetIsRender(false);
		ppNumObjects[23]->SetIsRender(true);
		
		ppNumObjects[23]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[0]];
	}
	if (score.size() > 1)
	{
		ppNumObjects[22]->SetIsRender(true);
		ppNumObjects[22]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[1]];
		ppNumObjects[23]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[0]];
	}
	if (score.size() > 2)
	{
		ppNumObjects[21]->SetIsRender(true);
		ppNumObjects[21]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[2]];
		ppNumObjects[22]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[1]];
		ppNumObjects[23]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[0]];
	}
	if (score.size() > 3)
	{
		ppNumObjects[20]->SetIsRender(true);
		ppNumObjects[20]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[3]];
		ppNumObjects[21]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[2]];
		ppNumObjects[22]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[1]];
		ppNumObjects[23]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[0]];
	}
	if (score.size() > 4)
	{
		ppNumObjects[19]->SetIsRender(true);
		ppNumObjects[19]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[4]];
		ppNumObjects[20]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[3]];
		ppNumObjects[21]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[2]];
		ppNumObjects[22]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[1]];
		ppNumObjects[23]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[0]];
	}
	if (score.size() > 5)
	{
		ppNumObjects[18]->SetIsRender(true);
		ppNumObjects[18]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[5]];
		ppNumObjects[19]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[4]];
		ppNumObjects[20]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[3]];
		ppNumObjects[21]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[2]];
		ppNumObjects[22]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[1]];
		ppNumObjects[23]->m_pUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui11_speed_number_o", OBJ_SPEED_UI)->m_ppUITexture[score[0]];
	}

	speed.clear();
	alt.clear();
	missile.clear();
	timeS.clear();
	timeM.clear();
	timeH.clear();
	score.clear();
}