#pragma once
#include "CGameObject.h"

class CPlane : public CGameObject
{
public:
	CPlane();
	virtual ~CPlane();
	virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera = NULL);
	virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList, D3D12_VERTEX_BUFFER_VIEW d3dInstancingBufferView, UINT nInstances, CPlaneMesh* pPlaneMesh);
};

