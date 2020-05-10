#pragma once
#include "CVertex.h"
#include "CMesh.h"

class CPlaneMesh : public CMesh
{
public:
	CPlaneMesh(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, float fWidth = 1.0f, float fHeight = 1.0f, float fDepth = 1.0f, XMFLOAT2 xmf2LeftTop = XMFLOAT2(1.0f, 1.0f), XMFLOAT2 xmf2LeftBot = XMFLOAT2(1.0f, 1.0f), XMFLOAT2 xmf2RightBot = XMFLOAT2(1.0f, 1.0f), XMFLOAT2 xmf2RightTop = XMFLOAT2(1.0f, 1.0f), float fAddrX = 1.f, float fAddrY = 1.f);
	virtual ~CPlaneMesh();

	void Render(ID3D12GraphicsCommandList* pd3dCommandList, D3D12_VERTEX_BUFFER_VIEW d3dInstancingBufferView, UINT nInstances);
};

