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
	for (auto i = 0; i < OBJ_END; ++i)
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

	// Collision
	GET_MANAGER<CollisionManager>()->CollisionSphere(&m_mapObj[OBJ_ENEMY], &m_mapObj[OBJ_MISSLE]);
	/*GET_MANAGER<CollisionManager>()->CollisionRect(&m_mapObj[OBJ_PLAYER], &m_mapObj[OBJ_MONSTER]);
	GET_MANAGER<CollisionManager>()->CollisionRectEx(&m_mapObj[OBJ_PLAYER], &m_mapObj[OBJ_MONSTER]);
	GET_MANAGER<CollisionManager>()->CollisionPixelToRect(&m_mapObj[OBJ_BACK], &m_mapObj[OBJ_PLAYER]);
	GET_MANAGER<CollisionManager>()->CollisionRect(&m_mapObj[OBJ_PLAYER], &m_mapObj[OBJ_PORTAL]);*/
	
	//Minimap
	GET_MANAGER<MinimapManager>()->MoveMinimapPoint(&m_mapObj[OBJ_PLAYER], &m_mapObj[OBJ_MINIMAP_PLAYER], &m_mapObj[OBJ_ENEMY], &m_mapObj[OBJ_MINIMAP_ENEMY]);

}

void ObjectManager::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	for (auto i = 0; i < OBJ_END; ++i)
	{
		for (auto& obj : m_mapObj[i])
		{
			obj.second->Render(pd3dCommandList, pCamera);
			obj.second->UpdateTransform(NULL);
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
				else 
				{
					obj.second->Release();
					delete obj.second;
					obj.second = nullptr;
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