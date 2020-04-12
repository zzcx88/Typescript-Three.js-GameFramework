#pragma once
#include "SingletonBase.h"

class CGameObject;
class ObjectManager : public SingletonBase<ObjectManager>
{
public:
	ObjectManager();
	virtual ~ObjectManager();

public:
	typedef std::unordered_multimap<const TCHAR*, CGameObject*>	MAPOBJ;

public:
	const TCHAR* GetTagFromObj(CGameObject* Obj, OBJTYPE ObjType);

	MAPOBJ& GetObjFromType(OBJTYPE ObjType) { return m_mapObj[ObjType]; }
	CGameObject* GetObjFromTag(const TCHAR* tag, OBJTYPE ObjType);

public:
	void AddObject(const TCHAR* tag, CGameObject* Obj, OBJTYPE ObjType);
	void Update(const float& TimeDelta);
	void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);
	void ReleaseUploadBuffers();
	void ReleaseAll();
	void ReleaseFromType(OBJTYPE ObjType);
	void ReleaseObjFromTag(const TCHAR* tag, OBJTYPE ObjType);
	void ReleaseObj(CGameObject* Obj, OBJTYPE ObjType);

private:
	std::unordered_multimap<const TCHAR*, CGameObject*>			m_mapObj[OBJ_END];
	std::vector<CGameObject*> m_vecRender[RENDER_END];
};

