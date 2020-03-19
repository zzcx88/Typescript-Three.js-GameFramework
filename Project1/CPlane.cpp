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
	XMFLOAT3 xmf3CameraPos = pCamera->GetPosition();
	SetPosition(xmf3CameraPos.x, xmf3CameraPos.y, xmf3CameraPos.z);

	CGameObject::Render(pd3dCommandList, pCamera);
}