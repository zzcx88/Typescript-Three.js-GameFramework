#pragma once
#include "CGameObject.h"
#include "CBoxMesh.h"
class COrientedBoxCollider : public CGameObject
{
public:
	COrientedBoxCollider(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
	COrientedBoxCollider();
	virtual ~COrientedBoxCollider() {}

	void SetBoxCollider(XMFLOAT3& xmCenter, XMFLOAT3& xmExtents, XMFLOAT4& xmOriented);

	virtual void Animate(CMesh* pMesh, XMFLOAT4X4* xmf4x4World , XMFLOAT3 xmf3Positon);
	BoundingOrientedBox m_BoundingBox;
};

