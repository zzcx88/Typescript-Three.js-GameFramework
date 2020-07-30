#pragma once
#include "CGameObject.h"

class CCamera;
class CMissle : public CGameObject
{
public:
	CMissle(CGameObject* pObj);
	CMissle(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, XMFLOAT3* xmfTarget, XMFLOAT3 xmfLunchPosition, ObjectManager* pObjectManage);
	virtual ~CMissle();

public:
	XMFLOAT3					m_xmf3Position = XMFLOAT3(0.0f, 0.0f, 0.0f);
	XMFLOAT3					m_xmf3Right = XMFLOAT3(1.0f, 0.0f, 0.0f);
	XMFLOAT3					m_xmf3Up = XMFLOAT3(0.0f, 1.0f, 0.0f);
	XMFLOAT3					m_xmf3Look = XMFLOAT3(0.0f, 0.0f, 1.0f);
	XMFLOAT3					m_xmf3Velocity = XMFLOAT3(0.0f, 0.0f, 0.0f);
	XMFLOAT3* m_xmfTarget;
	XMFLOAT3					m_xmfLunchPosition = XMFLOAT3(0.0f, 0.0f, 0.0f);
	XMFLOAT3 m_xmfAngle = XMFLOAT3(0.0f, 0.0f, 0.0f);

	XMFLOAT3 m_xmfAxis;
	XMFLOAT3 m_xmf3TargetVector;

	bool m_bRefference = false;
	bool FirstFire = true;
	bool m_bLockOn = false;
	bool m_bCameraPlayed = false;
	bool m_bLaunchFromShip = false;
	bool m_bShipMissleTurn = false;

	float m_fAssertFrequence = 4.0f;
	float m_fDeleteFrequence = 5.0f;
	float m_fAddFogFrequence = 0.001f;
	float m_fAddFogTimeElapsed = 0.f;
	float m_fDeleteTimeElapsed = 0.f;

	float m_fTheta = 50.f;

	ID3D12Device* m_pd3dDevice;
	ID3D12GraphicsCommandList* m_pd3dCommandList;
	ID3D12RootSignature* m_pd3dGraphicsRootSignature;

	ObjectManager* m_ObjManager;

public:
	virtual void Animate(float fTimeElapsed);
	virtual void CollisionActivate(CGameObject* collideTarget);
	void Move(DWORD nDirection, float fDistance, bool bVelocity = false);
	void Move(const XMFLOAT3& xmf3Shift, bool bVelocity = false);
	void Rotate(XMFLOAT3* pxmf3Axis, float fAngle);
	void SetLookAt(float fTimeElapsed);
	virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);
};

