#pragma once


class CBlur {
public:
    CBlur(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
    virtual ~CBlur();

    void Render(ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, ID3D12Resource* CurrentBackBuffer);

}; 