#include "stdafx.h"
#include "UIManager.h"
#include "CGameObject.h"
#include "CUI.h"
#include "CNumber.h"
#include "CLockOnUI.h"

UIManager::UIManager()
{
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
			pLockOnUI->SetMesh((CMesh*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui8_lockon", OBJ_UI)->m_pLockOnUIPlaneMesh);
			pLockOnUI->m_ppLockOnUITexture[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui8_lockon", OBJ_UI)->m_ppLockOnUITexture[0];
			pLockOnUI->m_pLockOnUIMaterial = new CMaterial(1);
			pLockOnUI->m_pLockOnUIMaterial->SetTexture(pLockOnUI->m_ppLockOnUITexture[0]);
			pLockOnUI->m_pLockOnUIMaterial->SetShader(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui8_lockon", OBJ_UI)->m_pLockOnUIShader);
			pLockOnUI->SetMaterial(0, pLockOnUI->m_pLockOnUIMaterial);
			GET_MANAGER<ObjectManager>()->AddObject(L"LockOnInstance", pLockOnUI, OBJ_UI);
			
			Ene.second->m_pLockOnUI = pLockOnUI;
		}
	
		Ene.second->m_pLockOnUI->MoveLockOnUI(Ene.second->GetScreenPosition(), Ene.second->GetPosition(),
			PlyList->begin()->second->GetPosition(), PlyList->begin()->second->GetLook(), Ene.second->m_pLockOnUI, PlyList->begin()->second->m_pCamera);
		
		if (Ene.second->m_pLockOnUI->bDetectable == true)
		{
			GameOBJs.emplace_back(Ene.second);

			sort(begin(GameOBJs), end(GameOBJs), [](const CGameObject* a, const CGameObject* b) {
				return a->m_xmf4x4World._41 < b->m_xmf4x4World._41;
				});

			//cout << Ene.second->m_pLockOnUI->GetState() << ", " << Ene.second->GetState() << endl;
			if(Ene.second->m_bAiming == true&&Ene.second->GetState() != true)

			{ 
				if (Ene.second->m_pLockOnUI->bLockOn == true)
				{
					Ene.second->m_pLockOnUI->m_nTextureRender = 0;
					Ene.second->m_pLockOnUI->m_pLockOnUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()
						->GetObjFromTag(L"player_ui8_lockon", OBJ_UI)->m_ppLockOnUITexture[1];
					Ene.second->m_bCanFire = true;
				}
				else 
				{
					Ene.second->m_pLockOnUI->m_pLockOnUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()
						->GetObjFromTag(L"player_ui8_lockon", OBJ_UI)->m_ppLockOnUITexture[0];
					Ene.second->m_pLockOnUI->TextureAnimate();
					Ene.second->m_bCanFire = false;
				}
			}
			else
			{
				Ene.second->m_pLockOnUI->m_nTextureRender = 0;
				Ene.second->m_pLockOnUI->m_pLockOnUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()
					->GetObjFromTag(L"player_ui8_lockon", OBJ_UI)->m_ppLockOnUITexture[0];
			}
			
		}
		else
		{
			Ene.second->m_bAiming = false;
			Ene.second->m_pLockOnUI->m_pLockOnUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()
				->GetObjFromTag(L"player_ui8_lockon", OBJ_UI)->m_ppLockOnUITexture[0];
		}

	}

	for (int i = 0; i < GameOBJs.size(); ++i)
	{
		if (i == Count)
			GameOBJs[i]->m_bAiming = true;
		else
		{
			GameOBJs[i]->m_bAiming = false;
			GameOBJs[i]->m_bCanFire = false;
			GameOBJs[i]->m_pLockOnUI->m_nTextureRender = 0;
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

	
	GameOBJs.clear();
}


void UIManager::NumberTextureAnimate(int fPlayerSpeed, ObjectManager::MAPOBJ* EneList)
{
	vector<int> v;

	while (fPlayerSpeed != 0)
	{
		v.emplace_back(fPlayerSpeed % 10);

		fPlayerSpeed /= 10;
	}

	

	v.clear();
	
}