#include "stdafx.h"
#include "ObjectManager.h"
#include "CGameObject.h"

ObjectManager::ObjectManager()
{
}

ObjectManager::~ObjectManager()
{
	ReleaseAll();
}

const TCHAR* ObjectManager::GetTagFromObj(CGameObject* Obj, OBJTYPE ObjType)
{
	MAPOBJ::iterator iter = find_if(begin(m_mapObj[ObjType]), end(m_mapObj[ObjType]),
		[&](auto& p) {return p.second == Obj; });

	if (end(m_mapObj[ObjType]) == iter)
		return nullptr;

	return iter->first;
}

CGameObject* ObjectManager::GetObjFromTag(const TCHAR* tag, OBJTYPE ObjType)
{
	MAPOBJ::iterator iter = find_if(begin(m_mapObj[ObjType]), end(m_mapObj[ObjType]),
		[&](auto& p) {return 0 == wcscmp(p.first, tag); });

	if (m_mapObj[ObjType].end() == iter)
		return nullptr;

	return (iter)->second;
}

void ObjectManager::AddObject(const TCHAR* tag, CGameObject* Obj, OBJTYPE ObjType)
{
	if (nullptr == Obj)
		return;

	Obj->SetObjectType(ObjType);

	m_mapObj[ObjType].insert(MAPOBJ::value_type(tag, Obj));
}

void ObjectManager::Update(const float& TimeDelta)
{
	// Update
	if (GET_MANAGER<SceneManager>()->GetSceneStoped() != true)
	{
		for (auto i = 0; i < OBJ_MENU; ++i)
		{
			const auto& iter_begin = m_mapObj[i].begin();
			const auto& iter_end = m_mapObj[i].end();

			for (auto iter = iter_begin; iter != iter_end;)
			{
				// 죽은 상태라면 컨테이너에서 삭제한다.
				if (true == (*iter).second->GetState())
				{
					//(*iter).second->Release();
					delete (*iter).second;
					(*iter).second = nullptr;
					iter = m_mapObj[i].erase(iter);
				}
				else
				{
					(*iter).second->Animate(TimeDelta);
					++iter;
				}
			}
		}
	}
	else
	{
		const auto& iter_begin = m_mapObj[OBJ_MENU].begin();
		const auto& iter_end = m_mapObj[OBJ_MENU].end();

		for (auto iter = iter_begin; iter != iter_end;)
		{
			// 죽은 상태라면 컨테이너에서 삭제한다.
			if (true == (*iter).second->GetState())
			{
				//(*iter).second->Release();
				delete (*iter).second;
				(*iter).second = nullptr;
				iter = m_mapObj[OBJ_MENU].erase(iter);
			}
			else
			{
				(*iter).second->Animate(TimeDelta);
				++iter;
			}
		}
	}
	// Collision
	GET_MANAGER<CollisionManager>()->CollisionSphere(&m_mapObj[OBJ_ENEMY], &m_mapObj[OBJ_ALLYMISSLE]);
	GET_MANAGER<CollisionManager>()->CollisionSphere(&m_mapObj[OBJ_PLAYER], &m_mapObj[OBJ_ENEMISSLE]);
	GET_MANAGER<CollisionManager>()->CollisionSphere(&m_mapObj[OBJ_ENEMY], &m_mapObj[OBJ_ALLYBULLET]);

	//GET_MANAGER<CollisionManager>()->CollisionSphereToOrientedBox(&m_mapObj[OBJ_ENEMY], & m_mapObj[OBJ_ALLYBULLET]);
	GET_MANAGER<CollisionManager>()->CollisionFloor();
	if (GET_MANAGER<SceneManager>()->GetCurrentSceneState() == SCENE_TEST)
	{
		GET_MANAGER<UIManager>()->NumberTextureAnimate(&m_mapObj[OBJ_PLAYER], GET_MANAGER<CDeviceManager>()->GetGameTimer().GetTimeElapsed());
	}
}

void ObjectManager::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera, bool bPreRender)
{
	if (bPreRender == false)
	{
		for (auto i = 0; i < OBJ_END; ++i)
		{
			for (auto& obj : m_mapObj[i])
			{
				if (OBJ_ENEMY)
					obj.second->SetScreenPos(obj.second->GetPosition(), pCamera);

				obj.second->Render(pd3dCommandList, pCamera);
				obj.second->UpdateTransform(NULL);
			}
		}
	}
	else
	{
		for (auto i = 0; i < OBJ_END; ++i)
		{
			for (auto& obj : m_mapObj[i])
			{
				if (i <= OBJ_TEST)
				{
					if (obj.first == L"EngineRefractionObj")
					{
					}
					else
					{
						obj.second->Render(pd3dCommandList, pCamera);
						//if(obj.first != L"MissleFogInstance")
						if(i != OBJ_EFFECT)
							obj.second->UpdateTransform(NULL);
					}
				}
			}
		}
	}

	if (bPreRender == false)
	{
		if (GET_MANAGER<SceneManager>()->GetCurrentSceneState() == SCENE_TEST)
		{
			// Minimap
			GET_MANAGER<UIManager>()->MoveMinimapPoint(&m_mapObj[OBJ_PLAYER], &m_mapObj[OBJ_ENEMY]);

			// LockOn
			GET_MANAGER<UIManager>()->MoveLockOnUI(&m_mapObj[OBJ_PLAYER], &m_mapObj[OBJ_ENEMY]);
		}
	}
}

void ObjectManager::ReleaseUploadBuffers()
{
	for (auto i = 0; i < OBJ_END; ++i)
	{
		const auto& iter_begin = m_mapObj[i].begin();
		const auto& iter_end = m_mapObj[i].end();
		for (auto iter = iter_begin; iter != iter_end;)
		{
			(*iter).second->ReleaseUploadBuffers();
			++iter;
		}
	}
}

void ObjectManager::ReleaseAll()
{
	for (auto i = 0; i < OBJ_END; ++i)
	{
		for (auto& obj : m_mapObj[i])
		{
			if (nullptr != obj.second)
			{
				if (obj.second->m_ObjType == OBJ_MAP || obj.second->m_ObjType == OBJ_UI)
				{
					delete obj.second;
					obj.second = nullptr;
				}
				else if (obj.second->m_ObjType == OBJ_SPEED_UI)
					continue;
				else 
				{
					if(obj.second->m_ObjType == OBJ_ENEMY && obj.second->m_bReffernce || obj.second->m_ObjType == OBJ_PLAYER && GET_MANAGER<SceneManager>()->GetCurrentSceneState() == SCENE_TEST )
						obj.second->Release();
					else
					{
						delete obj.second;
						obj.second = nullptr;
					}

				}
			}
		}
		m_mapObj[i].clear();
	}
}

void ObjectManager::ReleaseFromType(OBJTYPE ObjType)
{
	for (auto& obj : m_mapObj[ObjType])
	{
		if (nullptr != obj.second)
		{
			delete obj.second;
			obj.second = nullptr;
		}
	}
	m_mapObj[ObjType].clear();
}

void ObjectManager::ReleaseObjFromTag(const TCHAR* tag, OBJTYPE ObjType)
{
	MAPOBJ::iterator iter = find_if(begin(m_mapObj[ObjType]), end(m_mapObj[ObjType]),
		[&](auto& p) {return 0 == wcscmp(p.first, tag); });

	if (m_mapObj[ObjType].end() == iter)
		return;

	if (nullptr != iter->second)
	{
		delete iter->second;
		iter->second = nullptr;
	}

	m_mapObj[ObjType].erase(iter);
}

void ObjectManager::ReleaseObj(CGameObject* Obj, OBJTYPE ObjType)
{
	ReleaseObjFromTag(GetTagFromObj(Obj, ObjType), ObjType);
}