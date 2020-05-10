#pragma once
#include "CVertex.h"
#include "CMesh.h"

class CBoxMesh : public CMesh
{
public:
	CBoxMesh(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, float fWidth = 20.0f, float fHeight = 20.0f, float fDepth = 20.0f);
	virtual ~CBoxMesh();

	void Render(ID3D12GraphicsCommandList* pd3dCommandList, D3D12_VERTEX_BUFFER_VIEW d3dInstancingBufferView, UINT nInstances);
};