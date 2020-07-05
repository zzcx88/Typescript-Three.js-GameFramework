#pragma once
#include "CGameObject.h"

class CNavigator : public CGameObject
{
	XMFLOAT3 m_xmf3FixTarget = XMFLOAT3(0, 0, 0);

public:
	CNavigator(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
	virtual ~CNavigator();

	virtual void Animate(float fTimeElapsed);
	void SetLookAt(XMFLOAT3& xmfTarget);
	void NevSetLookAt(XMFLOAT3& xmf3LookAt);
	void Rotate(XMFLOAT3* pxmf3Axis, float fAngle);

	virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera = NULL);
};
