#include "stdafx.h"
#include "CPlane.h"

#define TEXTURES    7

CPlane::CPlane() : CGameObject(1)
{
}

CPlane::~CPlane()
{
}

void CPlane::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	CGameObject::Render(pd3dCommandList, pCamera);
}