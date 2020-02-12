#pragma once
#include "CGameObject.h"
class CAngrybotObject : public CGameObject
{
public:
	CAngrybotObject(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
	virtual ~CAngrybotObject();

public:
	virtual void OnPrepareAnimate();
	virtual void Animate(float fTimeElapsed);
};

