#pragma once
#include "CPlane.h"


class CAnimateUI : public CPlane
{

public:
	CAnimateUI();
	CAnimateUI(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth, XMFLOAT2 xmf2LeftTop, XMFLOAT2 xmf2LeftBot, XMFLOAT2 xmf2RightBot, XMFLOAT2 xmf2RightTop);
	virtual ~CAnimateUI();
	void SetLookAt(XMFLOAT3& xmfTarget);

	virtual void Animate(float fTimeElapsed);
	void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);
};

