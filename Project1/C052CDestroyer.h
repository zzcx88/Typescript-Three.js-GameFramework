#pragma once
#include "CGameObject.h"

class C052CDestroyer : public CGameObject
{
public:
	C052CDestroyer();
	C052CDestroyer(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
	virtual ~C052CDestroyer();

	float m_fMoveFowardElapsed = 0.f;
	float m_fElapsedFrequency = 3.f;

	float m_fMissleFireFrequence = 10.0f;

	ObjectManager* m_ObjManager;

private:
	CGameObject* m_pLeftWingEdge = NULL;
	CGameObject* m_pRightWingEdge = NULL;

	float m_fAddFogFrequence = 0.001f;
	float m_fAddFogTimeElapsed = 0.f;

public:
	virtual void OnPrepareAnimate();
	virtual void Animate(float fTimeElapsed);
	void CollisionActivate(CGameObject* collideTarget);
	virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);
};
