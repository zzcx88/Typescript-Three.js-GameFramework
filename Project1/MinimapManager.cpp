#include "stdafx.h"
#include "MinimapManager.h"
#include "CGameObject.h"
#include "CUI.h"
#include "CPlaneMesh.h"

MinimapManager::MinimapManager() 
{
}

MinimapManager::~MinimapManager()
{

}

void MinimapManager::MoveMinimapPoint(ObjectManager::MAPOBJ* PlyList, ObjectManager::MAPOBJ* PPntList, ObjectManager::MAPOBJ* EneList, ObjectManager::MAPOBJ* EPntList)
{
	//////////////////////////이곳의 주석문 부분은 내가 올린 오브젝트 매니저에 플레이어 담은 작업을 마친 커밋을 풀 받은 후 사용한다 //////////////////////////
	if (PlyList->begin()->second->m_pUI == NULL)
	{
		//플레이어에 미니맵 포인트가 없다면 생성
		CUI* pUI;
		pUI = new CUI();
		pUI->SetMesh((CMesh*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui7_minimap_green", OBJ_MINIMAP_PLAYER)->m_pUIPlaneMesh);
		//반복문 돌릴 필요 없음
		pUI->m_ppUITexture[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui7_minimap_green", OBJ_MINIMAP_PLAYER)->m_ppUITexture[7];
		pUI->m_pUIMaterial = new CMaterial(1);
		pUI->m_pUIMaterial->SetTexture(pUI->m_ppUITexture[7]);
		pUI->m_pUIMaterial->SetShader(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui7_minimap_green", OBJ_MINIMAP_PLAYER)->m_pUIShader);
		pUI->SetMaterial(0, pUI->m_pUIMaterial);
		GET_MANAGER<ObjectManager>()->AddObject(L"MinimapInstance", pUI, OBJ_MINIMAP_PLAYER);

		//오브젝트 내의 m_pUI에 생성된 pUI를 넣는다. CGameObject::CollisionActive함수에서 삭제가 용이하기 때문
		PlyList->begin()->second->m_pUI = pUI;
	}
	else
	{
		//플레이어에 미니맵 포인트가 있다면 갱신
		PlyList->begin()->second->m_pUI->MoveMinimapPoint(PlyList->begin()->second->GetPosition(), PlyList->begin()->second->m_pUI);
	}
	/////////////////////////이곳의 주석문 부분은 내가 올린 오브젝트 매니저에 플레이어 담은 작업을 마친 커밋을 풀 받은 후 사용한다///////////////////////////


	//공중 오브젝트 적은 묶어서 한번에
	for (auto& Dst : *EneList)
	{
		//적 오브젝트의 m_pUI가 비어있을 경우엔 새로 pUI를 동적할당한다.
		if (Dst.second->m_pUI == NULL)
		{
			CUI* pUI;
			pUI = new CUI();
			pUI->SetMesh((CMesh*)GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui10_minimap_red", OBJ_MINIMAP_ENEMY)->m_pUIPlaneMesh);
			//반복문 돌릴 필요 없음
			pUI->m_ppUITexture[0] = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui10_minimap_red", OBJ_MINIMAP_ENEMY)->m_ppUITexture[8];
			pUI->m_pUIMaterial = new CMaterial(1);
			pUI->m_pUIMaterial->SetTexture(pUI->m_ppUITexture[8]);
			pUI->m_pUIMaterial->SetShader(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui10_minimap_red", OBJ_MINIMAP_ENEMY)->m_pUIShader);
			pUI->SetMaterial(0, pUI->m_pUIMaterial);
			GET_MANAGER<ObjectManager>()->AddObject(L"MinimapInstance", pUI, OBJ_MINIMAP_ENEMY);

			//오브젝트 내의 m_pUI에 생성된 pUI를 넣는다. CGameObject::CollisionActive함수에서 삭제가 용이하기 때문
			Dst.second->m_pUI = pUI;
		}
		//오브젝트 내의 m_pUI의 함수를 통해 좌표갱신을 호출한다.
		Dst.second->m_pUI->MoveMinimapPoint(Dst.second->GetPosition(),Dst.second->m_pUI);
	}
	//지상 오브젝트 적도 묶어서 한번에



	//공중 오브젝트 아군도 묶어서 한번에

	

	//지상 오브젝트 아군도 묶어서 한번에
}