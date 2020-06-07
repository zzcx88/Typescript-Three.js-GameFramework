#pragma once
#include "CGameObject.h"

class CSuperCobraObject : public CGameObject
{
public:
	CSuperCobraObject();
	CSuperCobraObject(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
	virtual ~CSuperCobraObject();

	float m_fMoveFowardElapsed = 0.f;
	float m_fElapsedFrequency = 3.f;

	float m_fMissleFireFrequence = 10.0f;
	float m_fAfterFireFrequence = 4.f;
	float m_fMissleFireElapsed = 0.f;
	
	ObjectManager* m_ObjManager;

private:
	CGameObject* m_pMainRotorFrame = NULL;
	CGameObject* m_pTailRotorFrame = NULL;

public:
	virtual void OnPrepareAnimate();
	virtual void Animate(float fTimeElapsed);
	void CollisionActivate(CGameObject* collideTarget);
	virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);
};
