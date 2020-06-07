#pragma once
#include "CPlane.h"


class CMinimap : public CPlane
{

public:
	CMinimap();
	CMinimap(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth, XMFLOAT2 xmf2LeftTop, XMFLOAT2 xmf2LeftBot, XMFLOAT2 xmf2RightBot, XMFLOAT2 xmf2RightTop);
	virtual ~CMinimap();

	void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);
};

