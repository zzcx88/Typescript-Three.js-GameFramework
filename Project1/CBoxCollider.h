#pragma once
#include "CGameObject.h"

class COrientedBoxCollider : public CGameObject
{
public:
	COrientedBoxCollider(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
	COrientedBoxCollider(CLoadedModelInfo* pBoxModel);
	virtual ~COrientedBoxCollider() {}

	void SetBoxCollider(XMFLOAT3& xmCenter, XMFLOAT3& xmExtents, XMFLOAT4& xmOriented);

	virtual void Animate(float fTimeElapsed, XMFLOAT3 xmCenter);
	BoundingOrientedBox m_BoundingBox;
};

