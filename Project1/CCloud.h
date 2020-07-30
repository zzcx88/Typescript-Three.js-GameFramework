#pragma once
#include "CPlane.h"
#include "CPlaneMesh.h"

class CCloud : public CPlane
{
public:
	XMFLOAT3					m_xmf3Position = XMFLOAT3(0.0f, 0.0f, 0.0f);
	XMFLOAT3					m_xmf3Right = XMFLOAT3(1.0f, 0.0f, 0.0f);
	XMFLOAT3					m_xmf3Up = XMFLOAT3(0.0f, 1.0f, 0.0f);
	XMFLOAT3					m_xmf3Look = XMFLOAT3(0.0f, 0.0f, 1.0f);
	XMFLOAT3					m_xmf3Velocity = XMFLOAT3(0.0f, 0.0f, 0.0f);

	CCamera* m_pCamera;
	CMaterial* m_pCloudMaterial;
	CTexture* m_pCloudTexture[8];
	CCloudShader* m_pCloudShader;
	CPlayer* m_pPlayer;

	ID3D12Resource* m_pd3dInstancesBuffer = NULL;
	ID3D12Resource* m_pd3dInstanceUploadBuffer = NULL;
	D3D12_VERTEX_BUFFER_VIEW		m_d3dInstancingBufferView;

	UINT m_nInstance;
	bool m_bBuildFirst = true;
public:
	CCloud(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
	CCloud(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fXPos, float fZPos, UINT nInstance, std::default_random_engine dre);
	virtual ~CCloud();

public:
	//게임 객체가 카메라에 보인는 가를 검사한다. 
	bool IsVisible(CCamera *pCamera=NULL);


	virtual void Animate(float fTimeElapsed);
	void SetLookAt(XMFLOAT3& xmfTarget);
	void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);
};

