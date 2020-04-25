#include "stdafx.h"
#include "CPlaneMesh.h"

CPlaneMesh::CPlaneMesh(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, float fWidth, float fHeight, float fDepth, XMFLOAT2 xmf2LeftTop, XMFLOAT2 xmf2LeftBot, XMFLOAT2 xmf2RightBot, XMFLOAT2 xmf2RightTop, float fAddrX, float fAddrY) : CMesh(pd3dDevice, pd3dCommandList)
{
	m_nVertices = 6;
	m_nStride = sizeof(CTexturedVertex);
	m_nOffset = 0;
	m_nSlot = 0;
	m_d3dPrimitiveTopology = D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST;

	float fx = fWidth * 0.5f, fy = fHeight * 0.5f, fz = fDepth * 0.5f;

	CTexturedVertex pVertices[6];

	pVertices[0] = CTexturedVertex(XMFLOAT3(-fx + xmf2LeftTop.x, +fy + xmf2LeftTop.y, -fz), XMFLOAT2(0.0f, 0.0f));
	pVertices[1] = CTexturedVertex(XMFLOAT3(+fx + xmf2RightTop.x, +fy + xmf2RightTop.y, -fz), XMFLOAT2(fAddrX, 0.0f));
	pVertices[2] = CTexturedVertex(XMFLOAT3(+fx + xmf2RightBot.x, -fy + xmf2RightBot.y, -fz), XMFLOAT2(fAddrX, fAddrY));
				 
	pVertices[3] = CTexturedVertex(XMFLOAT3(-fx + xmf2LeftTop.x, +fy + xmf2LeftTop.y, -fz), XMFLOAT2(0.0f, 0.0f));
	pVertices[4] = CTexturedVertex(XMFLOAT3(+fx + xmf2RightBot.x, -fy + xmf2RightBot.y, -fz), XMFLOAT2(fAddrX, fAddrY));
	pVertices[5] = CTexturedVertex(XMFLOAT3(-fx + xmf2LeftBot.x, -fy + xmf2LeftBot.y, -fz), XMFLOAT2(0.0f, fAddrY));

	m_pd3dPositionBuffer = CreateBufferResource(pd3dDevice, pd3dCommandList, pVertices, m_nStride * m_nVertices, D3D12_HEAP_TYPE_DEFAULT, D3D12_RESOURCE_STATE_VERTEX_AND_CONSTANT_BUFFER, &m_pd3dPositionUploadBuffer);


	m_d3dPositionBufferView.BufferLocation = m_pd3dPositionBuffer->GetGPUVirtualAddress();
	m_d3dPositionBufferView.StrideInBytes = m_nStride;
	m_d3dPositionBufferView.SizeInBytes = m_nStride * m_nVertices;

}

CPlaneMesh::~CPlaneMesh()
{
}

void CPlaneMesh::Render(ID3D12GraphicsCommandList* pd3dCommandList, D3D12_VERTEX_BUFFER_VIEW d3dInstancingBufferView, UINT nInstances)
{
	D3D12_VERTEX_BUFFER_VIEW pVertexBufferViews[] = { m_d3dPositionBufferView, d3dInstancingBufferView };
	pd3dCommandList->IASetVertexBuffers(0, _countof(pVertexBufferViews), pVertexBufferViews);
	pd3dCommandList->IASetPrimitiveTopology(m_d3dPrimitiveTopology);
	pd3dCommandList->DrawInstanced(6, nInstances, 0, 0);
}
