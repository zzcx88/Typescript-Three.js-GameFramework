#pragma once
#include "CBlurFilter.h"

class CBlur : public CBlurFilter
{
public:
    CBlur(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
    virtual ~CBlur();


    virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, CCamera* pCamera, ID3D12Resource* CurrentBackBuffer);
   
}; 