#pragma once
#include "CGameObject.h"

class CSphereCollider : public CGameObject
{
public:
	CSphereCollider() {}
	CSphereCollider(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
	CSphereCollider(CLoadedModelInfo* pSphereModel);
	virtual ~CSphereCollider() {}
	
	void SetSphereCollider(XMFLOAT3& xmCenter, float fRadius);

	virtual void Animate(float fTimeElapsed, XMFLOAT3 xmCenter);
	BoundingSphere m_BoundingSphere;

	float m_fBulletSpeed = 0;
	bool m_bisBullet = false;

};

