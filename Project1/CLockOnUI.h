#pragma once
#include "CPlane.h"

class CLockOnUI : public CPlane
{
public:
	XMFLOAT3					m_xmf3Position = XMFLOAT3(0.0f, 0.0f, 0.0f);
	XMFLOAT3					m_xmf3Right = XMFLOAT3(1.0f, 0.0f, 0.0f);
	XMFLOAT3					m_xmf3Up = XMFLOAT3(0.0f, 1.0f, 0.0f);
	XMFLOAT3					m_xmf3Look = XMFLOAT3(0.0f, 0.0f, 1.0f);

	XMFLOAT2 m_xmf2PrePositionLeftTop = XMFLOAT2(0.f, 0.f);
	XMFLOAT2 m_xmf2PrePositionLeftBot = XMFLOAT2(0.f, 0.f);
	XMFLOAT2 m_xmf2PrePositionRightBot = XMFLOAT2(0.f, 0.f);
	XMFLOAT2 m_xmf2PrePositionRightTop = XMFLOAT2(0.f, 0.f);

	CCamera* m_pCamera;
	float m_fScaleX = 1, m_fScaleY = 1;

	float m_fTimeElapsed = 0.f;
	bool m_bRefference = false;

	CLockOnUI(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth, XMFLOAT2 xmf2LeftTop, XMFLOAT2 xmf2LeftBot, XMFLOAT2 xmf2RightBot, XMFLOAT2 xmf2RightTop);
	virtual ~CLockOnUI();

	
	void Render(XMFLOAT2 screen, XMFLOAT3& xmfTarget, XMFLOAT3& xmfPlayer, XMFLOAT3& xmfPlayerLook, CGameObject* pGameOBJ);

};

