#include "stdafx.h"
#include "CAngrybotObject.h"

CAngrybotObject::CAngrybotObject(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature)
{
}

CAngrybotObject::~CAngrybotObject()
{
}

void CAngrybotObject::OnPrepareAnimate()
{
}

void CAngrybotObject::Animate(float fTimeElapsed)
{
	CGameObject::Animate(fTimeElapsed);
}