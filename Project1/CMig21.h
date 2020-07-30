#pragma once
#include "CGameObject.h"

class CMig21 : public CGameObject
{
public:
	CMig21();
	CMig21(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
	virtual ~CMig21();

	XMFLOAT3 m_xmf3FallingPoint = XMFLOAT3(0, 0, 0);

	float m_fMoveFowardElapsed = 0.f;
	float m_fElapsedFrequency = 3.f;

	float m_fMissleFireFrequence = 10.0f;
	float m_fAfterFireFrequence = 4.f;

	float m_fMissleFireElapsed = 0.f;

	ObjectManager* m_ObjManager;

private:
	CGameObject* m_pLeftWingEdge = NULL;
	CGameObject* m_pRightWingEdge = NULL;

	float m_fAddFogFrequence = 0.01f;
	float m_fAddFogTimeElapsed = 0.f;

	float m_fAddCrushFogFrequence = 0.05f;
	float m_fAddCrushFogTimeElapsed = 0.f;

public:
	virtual void OnPrepareAnimate();
	virtual void Animate(float fTimeElapsed);
	void CollisionActivate(CGameObject* collideTarget);
	bool IsVisible(CCamera* pCamera = NULL);
	virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);
};
