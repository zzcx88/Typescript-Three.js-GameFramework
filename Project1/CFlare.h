#pragma once
#include "CGameObject.h"

class CCamera;
class CFlare : public CGameObject
{
public:
	XMFLOAT3 m_xmf3LaunchedUpVector = XMFLOAT3(0, 0, 0);

	float m_fDeleteFrequence = 1.0f;
	float m_DeleteElapsed = 0;

	float m_fAddCrushFogFrequence = 0.05f;
	float m_fAddCrushFogTimeElapsed = 0.f;

	float m_fTimeElapsed = 0.f;

	ObjectManager* m_ObjManager = NULL;
public:
	CFlare(XMFLOAT3 xmf3LaunchedUpVector);
	CFlare(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth);
	virtual ~CFlare();

	virtual void Animate(float fTimeElapsed);
	void TextureAnimate();
	void SetLookAt(XMFLOAT3& xmfTarget);
	void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);
};

