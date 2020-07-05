#pragma once
#include "CPlane.h"


class CMinimap : public CPlane
{
	float m_fTimeElapsed = 0.f;
	float m_fFadeTimeElapsed = 0.f;
	float m_fFadeFrequence = 0.1f;

	XMFLOAT3 prePosition = XMFLOAT3(0, 0, 0);
	XMFLOAT3 LookAt = XMFLOAT3(0, 0, 0);
public:
	CMinimap();
	CMinimap(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth, XMFLOAT2 xmf2LeftTop, XMFLOAT2 xmf2LeftBot, XMFLOAT2 xmf2RightBot, XMFLOAT2 xmf2RightTop);
	virtual ~CMinimap();

	void MoveMinimapPoint(XMFLOAT3& xmfPlayer, CGameObject* pGameOBJ);
	void Rotate(XMFLOAT3* pxmf3Axis, float fAngle);
	virtual void Animate(float fTimeElapsed);
	void SetLookAt(float fTimeElapsed);

	void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);
};

