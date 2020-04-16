#include "stdafx.h"
#include "UIManager.h"
#include "CGameObject.h"
#include "CUI.h"
#include "CLockOnUI.h"

UIManager::UIManager()
{
}

UIManager::~UIManager()
{
}

void UIManager::MoveMinimapPoint(ObjectManager::MAPOBJ* PlyList, ObjectManager::MAPOBJ* EneList)
{
	////////////////////////이곳의 주석문 부분은 내가 올린 오브젝트 매니저에 플레이어 담은 작업을 마친 커밋을 풀 받은 후 사용한다 //////////////////////////
	if (PlyList->begin()->second->m_pUI == NULL)
	{
		//플레이어에 미니맵 포인트가 없다면 생성
		CUI* pUI;
		pUI = new CUI();
		pUI->SetMesh((CMesh*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui7_minimap_green", OBJ_MINIMAP_PLAYER)->m_pUIPlaneMesh);
		//pUI->m_ppUITexture[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui7_minimap_green", OBJ_MINIMAP_PLAYER)->m_ppUITexture[6];
		pUI->m_pUIMaterial = new CMaterial(1);
		pUI->m_pUIMaterial->SetTexture(pUI->m_ppUITexture[6]);
		pUI->m_pUIMaterial->SetShader(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui7_minimap_green", OBJ_MINIMAP_PLAYER)->m_pUIShader);
		pUI->SetMaterial(0, pUI->m_pUIMaterial);
		GET_MANAGER<ObjectManager>()->AddObject(L"MinimapInstance", pUI, OBJ_MINIMAP_PLAYER);
		PlyList->begin()->second->m_pUI = pUI;
	}
	else
	{
		//플레이어에 미니맵 포인트가 있다면 갱신
		PlyList->begin()->second->m_pUI->MoveMinimapPoint(PlyList->begin()->second->GetPosition(), PlyList->begin()->second->m_pUI);
	}
	///////////////////////이곳의 주석문 부분은 내가 올린 오브젝트 매니저에 플레이어 담은 작업을 마친 커밋을 풀 받은 후 사용한다///////////////////////////


	//공중 오브젝트 적은 묶어서 한번에
	for (auto& Ene : *EneList)
	{
		//적 오브젝트의 m_pUI가 비어있을 경우엔 새로 pUI를 동적할당한다.
		if (Ene.second->m_pUI == NULL)
		{
			CUI* pUI;
			pUI = new CUI();
			pUI->SetMesh((CMesh*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui10_minimap_red", OBJ_MINIMAP_ENEMY)->m_pUIPlaneMesh);
			pUI->m_ppUITexture[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui10_minimap_red", OBJ_MINIMAP_ENEMY)->m_ppUITexture[8];
			pUI->m_pUIMaterial = new CMaterial(1);
			pUI->m_pUIMaterial->SetTexture(pUI->m_ppUITexture[8]);
			pUI->m_pUIMaterial->SetShader(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui10_minimap_red", OBJ_MINIMAP_ENEMY)->m_pUIShader);
			pUI->SetMaterial(0, pUI->m_pUIMaterial);
			GET_MANAGER<ObjectManager>()->AddObject(L"MinimapInstance", pUI, OBJ_MINIMAP_ENEMY);

			//오브젝트 내의 m_pUI에 생성된 pUI를 넣는다. CGameObject::CollisionActive함수에서 삭제가 용이하기 때문
			Ene.second->m_pUI = pUI;
		}
		//오브젝트 내의 m_pUI의 함수를 통해 좌표갱신을 호출한다.
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
			PlyList->begin()->second->GetPosition(), PlyList->begin()->second->GetLook(), Ene.second->m_pLockOnUI);

		if (Ene.second->m_pLockOnUI->LockOn == true)
		{
			cout << "조준 가능" << endl;
			if (Count == 0)
			{
				m_fMinLenth = Ene.second->m_pLockOnUI->m_fLenth;
				Ene.second->m_pLockOnUI->m_pLockOnUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui8_lockon", OBJ_UI)->m_ppLockOnUITexture[1];
				++Count;
			}
			else
			{
				m_fMinLenth = min(m_fMinLenth, Ene.second->m_pLockOnUI->m_fLenth);

				if(m_fMinLenth == Ene.second->m_pLockOnUI->m_fLenth)
								Ene.second->m_pLockOnUI->m_pLockOnUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui8_lockon", OBJ_UI)->m_ppLockOnUITexture[1];
				else 
					Ene.second->m_pLockOnUI->m_pLockOnUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui8_lockon", OBJ_UI)->m_ppLockOnUITexture[0];
			}

		}
		else
		{
			cout << "조준 불가능" << endl;
			Ene.second->m_pLockOnUI->m_pLockOnUIMaterial->m_ppTextures[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui8_lockon", OBJ_UI)->m_ppLockOnUITexture[0];
		}

	}

}