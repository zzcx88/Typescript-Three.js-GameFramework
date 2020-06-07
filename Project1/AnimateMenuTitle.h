#pragma once
#include "CPlane.h"
#include "CPlaneMesh.h"

class AnimateMenuTitle : public CPlane
{

public:
	AnimateMenuTitle();
	AnimateMenuTitle(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth);
	virtual ~AnimateMenuTitle();

	float m_fTimeElapsed = 0.f;
	float m_fFadeTimeElapsed = 0.f;
	float m_fFadeFrequence = 0.6f;

	int m_nTextureIndex = 0;
	int nCount = 0;

	bool add = false;
	bool sub = false;

	virtual void Animate(float fTimeElapsed);
	void TextureAnimate();
	void CountNumber();
	void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);

};