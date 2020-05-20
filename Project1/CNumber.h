#pragma once
#include "CPlane.h"
#include "CPlaneMesh.h"

class CNumber : public CPlane
{

public:
	CNumber();
	CNumber(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth);
	virtual ~CNumber();
	vector<int> v;
	bool m_bRefference = false;

	float m_fTimeElapsed = 0.f;
	float m_fFadeTimeElapsed = 0.f;
	float m_fFadeFrequence = 0.1f;

	int m_nTextureIndex = 0;

	virtual void Animate(float fTimeElapsed);
	void TextureAnimate();
	void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);

};