#pragma once
#include "CMesh.h"

class CVertex
{
public:
	XMFLOAT3						m_xmf3Position;

public:
	CVertex() { m_xmf3Position = XMFLOAT3(0.0f, 0.0f, 0.0f); }
	CVertex(float x, float y, float z) { m_xmf3Position = XMFLOAT3(x, y, z); }
	CVertex(XMFLOAT3 xmf3Position) { m_xmf3Position = xmf3Position; }
	~CVertex() { }
};

class CTexturedVertex : public CVertex
{
public:
	XMFLOAT2						m_xmf2TexCoord;

public:
	CTexturedVertex() { m_xmf3Position = XMFLOAT3(0.0f, 0.0f, 0.0f); m_xmf2TexCoord = XMFLOAT2(0.0f, 0.0f); }
	CTexturedVertex(float x, float y, float z, XMFLOAT2 xmf2TexCoord) { m_xmf3Position = XMFLOAT3(x, y, z); m_xmf2TexCoord = xmf2TexCoord; }
	CTexturedVertex(XMFLOAT3 xmf3Position, XMFLOAT2 xmf2TexCoord = XMFLOAT2(0.0f, 0.0f)) { m_xmf3Position = xmf3Position; m_xmf2TexCoord = xmf2TexCoord; }
	~CTexturedVertex() { }
};

class CPlaneMesh : public CMesh
{
public:
	CPlaneMesh(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, float fWidth = 1.0f, float fHeight = 1.0f, float fDepth = 1.0f, XMFLOAT2 xmf2LeftTop = XMFLOAT2(1.0f, 1.0f), XMFLOAT2 xmf2LeftBot = XMFLOAT2(1.0f, 1.0f), XMFLOAT2 xmf2RightBot = XMFLOAT2(1.0f, 1.0f), XMFLOAT2 xmf2RightTop = XMFLOAT2(1.0f, 1.0f), float fAddrX = 1.f, float fAddrY = 1.f);
	virtual ~CPlaneMesh();
};

