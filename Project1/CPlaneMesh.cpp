#include "stdafx.h"
#include "CPlaneMesh.h"

CPlaneMesh::CPlaneMesh(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, float fWidth, float fHeight, float fDepth, XMFLOAT2 xmf2LeftTop, XMFLOAT2 xmf2LeftBot, XMFLOAT2 xmf2RightBot, XMFLOAT2 xmf2RightTop) : CMesh(pd3dDevice, pd3dCommandList)
{
	m_nVertices = 6;
	m_nStride = sizeof(CTexturedVertex);
	m_nOffset = 0;
	m_nSlot = 0;
	m_d3dPrimitiveTopology = D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST;

	float fx = fWidth * 0.5f, fy = fHeight * 0.5f, fz = fDepth * 0.5f;

	/*pVertices[0] = CTexturedVertex(XMFLOAT3(-40.0f, +40.0f, 1.0f), XMFLOAT2(0.0f, 0.0f));
	pVertices[1] = CTexturedVertex(XMFLOAT3(+40.0f, +40.0f, 1.0f), XMFLOAT2(1.0f, 0.0f));
	pVertices[2] = CTexturedVertex(XMFLOAT3(-40.0f, -40.0f, 1.0f), XMFLOAT2(1.0f, 1.0f));
	pVertices[3] = CTexturedVertex(XMFLOAT3(-40.0f, -40.0f, 1.0f), XMFLOAT2(0.0f, 0.0f));
	pVertices[4] = CTexturedVertex(XMFLOAT3(+40.0f, +40.0f, 1.0f), XMFLOAT2(1.0f, 1.0f));
	pVertices[5] = CTexturedVertex(XMFLOAT3(+40.0f, -40.0f, 1.0f), XMFLOAT2(0.0f, 1.0f));*/

	m_pVertices[0] = CTexturedVertex(XMFLOAT3(-fx + xmf2LeftTop.x, +fy + xmf2LeftTop.y, -fz), XMFLOAT2(0.0f, 0.0f));
	m_pVertices[1] = CTexturedVertex(XMFLOAT3(+fx + xmf2RightTop.x, +fy + xmf2RightTop.y, -fz), XMFLOAT2(1.0f, 0.0f));
	m_pVertices[2] = CTexturedVertex(XMFLOAT3(+fx + xmf2RightBot.x, -fy + xmf2RightBot.y, -fz), XMFLOAT2(1.0f, 1.0f));
				 
	m_pVertices[3] = CTexturedVertex(XMFLOAT3(-fx + xmf2LeftTop.x, +fy + xmf2LeftTop.y, -fz), XMFLOAT2(0.0f, 0.0f));
	m_pVertices[4] = CTexturedVertex(XMFLOAT3(+fx + xmf2RightBot.x, -fy + xmf2RightBot.y, -fz), XMFLOAT2(1.0f, 1.0f));
	m_pVertices[5] = CTexturedVertex(XMFLOAT3(-fx + xmf2LeftBot.x, -fy + xmf2LeftBot.y, -fz), XMFLOAT2(0.0f, 1.0f));

	m_pd3dPositionBuffer = CreateBufferResource(pd3dDevice, pd3dCommandList, m_pVertices, m_nStride * m_nVertices, D3D12_HEAP_TYPE_DEFAULT, D3D12_RESOURCE_STATE_VERTEX_AND_CONSTANT_BUFFER, &m_pd3dPositionUploadBuffer);

	m_d3dPositionBufferView.BufferLocation = m_pd3dPositionBuffer->GetGPUVirtualAddress();
	m_d3dPositionBufferView.StrideInBytes = m_nStride;
	m_d3dPositionBufferView.SizeInBytes = m_nStride * m_nVertices;

	//m_nVertices = 6;
	//m_d3dPrimitiveTopology = D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST;

	//m_pxmf3Positions = new XMFLOAT3[m_nVertices];

	//float fx = fWidth * 0.5f, fy = fHeight * 0, fz = fDepth * 0;
	//// Front Quad (quads point inward)
	//m_pxmf3Positions[0] = XMFLOAT3(-fx, +fx, +fx);
	//m_pxmf3Positions[1] = XMFLOAT3(+fx, +fx, +fx);
	//m_pxmf3Positions[2] = XMFLOAT3(-fx, -fx, +fx);
	//m_pxmf3Positions[3] = XMFLOAT3(-fx, -fx, +fx);
	//m_pxmf3Positions[4] = XMFLOAT3(+fx, +fx, +fx);
	//m_pxmf3Positions[5] = XMFLOAT3(+fx, -fx, +fx);

	//m_pd3dPositionBuffer = ::CreateBufferResource(pd3dDevice, pd3dCommandList, m_pxmf3Positions, sizeof(XMFLOAT3) * m_nVertices, D3D12_HEAP_TYPE_DEFAULT, D3D12_RESOURCE_STATE_VERTEX_AND_CONSTANT_BUFFER, &m_pd3dPositionUploadBuffer);

	//m_d3dPositionBufferView.BufferLocation = m_pd3dPositionBuffer->GetGPUVirtualAddress();
	//m_d3dPositionBufferView.StrideInBytes = sizeof(XMFLOAT3);
	//m_d3dPositionBufferView.SizeInBytes = sizeof(XMFLOAT3) * m_nVertices;
}

CPlaneMesh::~CPlaneMesh()
{
}