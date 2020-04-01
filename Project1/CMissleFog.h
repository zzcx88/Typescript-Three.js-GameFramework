#pragma once
#include "CPlane.h"
#include "CPlaneMesh.h"

#define TEXTURES    1

class CMissleFog : public CPlane
{
public:
	XMFLOAT3					m_xmf3Position = XMFLOAT3(0.0f, 0.0f, 0.0f);
	XMFLOAT3					m_xmf3Right = XMFLOAT3(1.0f, 0.0f, 0.0f);
	XMFLOAT3					m_xmf3Up = XMFLOAT3(0.0f, 1.0f, 0.0f);
	XMFLOAT3					m_xmf3Look = XMFLOAT3(0.0f, 0.0f, 1.0f);
	XMFLOAT3					m_xmf3Velocity = XMFLOAT3(0.0f, 0.0f, 0.0f);

	CCamera*					m_pCamera;
	float m_fScaleX = 1, m_fScaleY = 1;

	float m_fAddFogFrequence = 1.5f;
	float m_fTimeElapsed = 0.f;
	bool m_RenderOff = false;
	bool m_bRefference = false;

public:
	CMissleFog();
	CMissleFog(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth);
	virtual ~CMissleFog();

	void FogCreate();
	virtual void Animate(float fTimeElapsed);
	void SetLookAt(XMFLOAT3& xmfTarget);
	void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);
};

