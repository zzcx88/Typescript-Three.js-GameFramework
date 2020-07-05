#pragma once
#include "CPlane.h"
#include "CPlaneMesh.h"

class CWaterDropRefraction : public CPlane
{
public:
	XMFLOAT3					m_xmf3Position = XMFLOAT3(0.0f, 0.0f, 0.0f);
	XMFLOAT3					m_xmf3Right = XMFLOAT3(1.0f, 0.0f, 0.0f);
	XMFLOAT3					m_xmf3Up = XMFLOAT3(0.0f, 1.0f, 0.0f);
	XMFLOAT3					m_xmf3Look = XMFLOAT3(0.0f, 0.0f, 1.0f);
	XMFLOAT3					m_xmf3Velocity = XMFLOAT3(0.0f, 0.0f, 0.0f);

	CCamera* m_pCamera = NULL;
	CTexture* pWaterTexture = NULL;

	float m_fScaleX = 1, m_fScaleY = 1;
	float m_fTimeElapsed = 0.f;
	float m_fRotateSpeed = 50.f;

	float m_fFadeTimeElapsed = 0.f;
	float m_fRotateFrequncy = 0.02f;

	int m_nTextureIndex = 0;

	bool m_RenderOff = false;

	UINT						m_nRtvDescriptorIncrementSize = 0;

	ID3D12CommandAllocator* m_pd3dCommandAllocator = NULL;
	ID3D12GraphicsCommandList* m_pd3dCommandList = NULL;

	ID3D12DescriptorHeap* m_pd3dRtvDescriptorHeap = NULL;
	ID3D12DescriptorHeap* m_pd3dDsvDescriptorHeap = NULL;

	D3D12_CPU_DESCRIPTOR_HANDLE		m_pd3dRtvCPUDescriptorHandles;
	D3D12_CPU_DESCRIPTOR_HANDLE		m_d3dDsvCPUDescriptorHandle;

	ID3D12Resource* m_pd3dDepthStencilBuffer = NULL;

public:
	CWaterDropRefraction();
	CWaterDropRefraction(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth);
	virtual ~CWaterDropRefraction();


	virtual void Animate(float fTimeElapsed);
	void TextureAnimate();
	virtual void SetLookAt(XMFLOAT3& xmfTarget);
	virtual void OnPreRender(ID3D12Device* pd3dDevice, ID3D12CommandQueue* pd3dCommandQueue, ID3D12Fence* pd3dFence, HANDLE hFenceEvent);
	void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);
};

