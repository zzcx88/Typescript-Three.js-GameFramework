#pragma once
#include "CPlane.h"

class CBullet : public CPlane
{
public:
	XMFLOAT3					m_xmf3Position = XMFLOAT3(0.0f, 0.0f, 0.0f);
	XMFLOAT3					m_xmf3Look = XMFLOAT3(0.0f, 0.0f, 1.0f);
	float					m_fBulletSpeed = 0.0f;

	float m_fDeleteFrequence = 2.0f;
	float m_fDeleteElapsed = 0.0f;

	bool m_bRefference = false;
public:
	CBullet() {}
	CBullet(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
	virtual ~CBullet();

	virtual void Animate(float fTimeElapsed);
	virtual void CollisionActivate(CGameObject* collideTarget);

	void Move(DWORD dwDirection, float fDistance);
	void Move(const XMFLOAT3& xmf3Shift);

	virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera = NULL);
};

