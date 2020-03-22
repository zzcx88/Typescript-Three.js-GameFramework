#pragma once
#include "CBlurFilter.h"

class CBlur 
{
public:
    CBlur(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
    ~CBlur();


    ID3D12PipelineState* m_pHBlurPipelineState;
    ID3D12PipelineState* m_pVBlurPipelineState;
    void CreateShaderVariables(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList);

  
}; 