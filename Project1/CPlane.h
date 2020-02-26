#pragma once
#include "CGameObject.h"

class CPlane : public CGameObject
{
public:
	CPlane(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
	virtual ~CPlane();
};

