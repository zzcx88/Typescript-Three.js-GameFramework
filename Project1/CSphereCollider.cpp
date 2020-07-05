#include "stdafx.h"
#include "CSphereCollider.h"

CSphereCollider::CSphereCollider(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature)
{
	CLoadedModelInfo* pModel = CGameObject::LoadGeometryAndAnimationFromFile(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature, "Model/Sphere.bin", NULL, MODEL_COL);
	SetChild(pModel->m_pModelRootObject);
	if (pModel) delete pModel;
}

CSphereCollider::CSphereCollider(CLoadedModelInfo* pSphereModel)
{
	SetChild(pSphereModel->m_pModelRootObject);
}

void CSphereCollider::SetSphereCollider(XMFLOAT3& xmCenter, float fRadius)
{
	m_BoundingSphere = BoundingSphere(xmCenter, fRadius);
}

void CSphereCollider::Animate(float fTimeElapsed, XMFLOAT3 xmCenter)
{
	if (m_bisBullet)
	{
		Move(DIR_FORWARD, m_fBulletSpeed * fTimeElapsed);
		m_BoundingSphere.Center = GetPosition();
	}
	else
		m_BoundingSphere.Center = xmCenter;
}
