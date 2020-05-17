#include "stdafx.h"
#include "COrientedBoxCollider.h"

COrientedBoxCollider::COrientedBoxCollider(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature)
{
	/*CLoadedModelInfo* pModel = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature, "Model/Box.bin", NULL, MODEL_COL);
	SetChild(pModel->m_pModelRootObject);
	if (pModel) delete pModel;*/
}

COrientedBoxCollider::COrientedBoxCollider()
{
}

void COrientedBoxCollider::SetBoxCollider(XMFLOAT3& xmCenter, XMFLOAT3& xmExtents, XMFLOAT4& xmOriented)
{
	m_BoundingBox = BoundingOrientedBox(xmCenter, xmExtents, xmOriented);
}

void COrientedBoxCollider::Animate(CMesh* pMesh, XMFLOAT4X4* xmf4x4World , XMFLOAT3 xmf3Positon)
{
	pMesh->m_xmOOBB.Transform(m_BoundingBox, XMLoadFloat4x4(xmf4x4World));
	XMStoreFloat4(&m_BoundingBox.Orientation, XMQuaternionNormalize(XMLoadFloat4(&m_BoundingBox.Orientation)));
}
