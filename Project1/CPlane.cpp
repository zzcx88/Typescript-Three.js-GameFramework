#include "stdafx.h"
#include "CPlane.h"
#include "CPlaneMesh.h"

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

void CPlane::Render(ID3D12GraphicsCommandList* pd3dCommandList, D3D12_VERTEX_BUFFER_VIEW d3dInstancingBufferView, UINT nInstances, CPlaneMesh* pPlaneMesh)
{
	pPlaneMesh->Render(pd3dCommandList, d3dInstancingBufferView, nInstances);
}
