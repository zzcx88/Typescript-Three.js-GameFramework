#pragma once
#include "CGameObject.h"

class CPlane : public CGameObject
{
public:
	CPlane();
	virtual ~CPlane();
	virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera = NULL);

};

