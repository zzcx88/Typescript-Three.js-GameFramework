#include "stdafx.h"
#include "CBoxCollider.h"

COrientedBoxCollider::COrientedBoxCollider(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature)
{
	/*CLoadedModelInfo* pModel = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature, "Model/Box.bin", NULL, MODEL_COL);
	SetChild(pModel->m_pModelRootObject);
	if (pModel) delete pModel;*/
}

COrientedBoxCollider::COrientedBoxCollider(CLoadedModelInfo* pBoxModel)
{
}

void COrientedBoxCollider::SetBoxCollider(XMFLOAT3& xmCenter, XMFLOAT3& xmExtents, XMFLOAT4& xmOriented)
{
	m_BoundingBox = BoundingOrientedBox(xmCenter, xmExtents, xmOriented);
}

void COrientedBoxCollider::Animate(float fTimeElapsed, XMFLOAT3 xmCenter)
{
	m_BoundingBox->Transform(m_xmOOBB, XMLoadFloat4x4(&m_xmf4x4World));
	XMStoreFloat4(&m_xmOOBB.Orientation, XMQuaternionNormalize(XMLoadFloat4(&m_xmOOBB.Orientation)));
}
