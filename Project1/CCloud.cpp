#include "stdafx.h"
#include "CCloud.h"
#include "CTestScene.h"
#include "CShaderManager.h"

#define TEXTURES 8

CCloud::CCloud(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fXPos, float fZPos, float fDepth, std::default_random_engine dre)
{
	m_nInstance = 1000;

	VS_VB_BILLBOARD_INSTANCE* pInstanceInfos = new VS_VB_BILLBOARD_INSTANCE[m_nInstance];

	std::uniform_real_distribution<float>y(5000, 6000);
	std::uniform_real_distribution<float>x(fXPos - 2000, fXPos + 2000);
	std::uniform_real_distribution<float>z(fZPos - 2000, fZPos + 2000);
	std::uniform_real_distribution<float>size(1, 2);
	float sizeTotal = size(dre);
	m_pPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, 1024 * sizeTotal, 768 * sizeTotal, fDepth, XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0));
	SetMesh(m_pPlaneMesh);

	for (int i = 0; i < m_nInstance; ++i)
	{
		pInstanceInfos[i].m_xmf3Position = XMFLOAT3(x(dre), y(dre), z(dre));
	}
	m_pd3dInstancesBuffer = ::CreateBufferResource(pd3dDevice, pd3dCommandList, pInstanceInfos, sizeof(VS_VB_BILLBOARD_INSTANCE) * m_nInstance, D3D12_HEAP_TYPE_DEFAULT, D3D12_RESOURCE_STATE_VERTEX_AND_CONSTANT_BUFFER, &m_pd3dInstanceUploadBuffer);

	m_d3dInstancingBufferView.BufferLocation = m_pd3dInstancesBuffer->GetGPUVirtualAddress();
	m_d3dInstancingBufferView.StrideInBytes = sizeof(VS_VB_BILLBOARD_INSTANCE);
	m_d3dInstancingBufferView.SizeInBytes = sizeof(VS_VB_BILLBOARD_INSTANCE) * m_nInstance;

	if (pInstanceInfos) delete[] pInstanceInfos;
}

CCloud::CCloud(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature)
{
	//m_pPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth, XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0));

	//SetMesh(m_pPlaneMesh);
	m_pCloudTexture[0] = new CTexture(1, RESOURCE_TEXTURE2D , 0);
	m_pCloudTexture[0]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/Cloud/cloud_1.dds", 0);
	m_pCloudTexture[1] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pCloudTexture[1]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/Cloud/cloud_2.dds", 0);
	m_pCloudTexture[2] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pCloudTexture[2]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/Cloud/cloud_3.dds", 0);
	m_pCloudTexture[3] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pCloudTexture[3]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/Cloud/cloud_4.dds", 0);
	m_pCloudTexture[4] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pCloudTexture[4]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/Cloud/cloud_5.dds", 0);
	m_pCloudTexture[5] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pCloudTexture[5]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/Cloud/cloud_6.dds", 0);
	m_pCloudTexture[6] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pCloudTexture[6]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/Cloud/cloud_7.dds", 0);
	m_pCloudTexture[7] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pCloudTexture[7]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/Cloud/cloud_8.dds", 0);

	m_pCloudShader = new CCloudShader();
	m_pCloudShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	for (int i = 0; i < TEXTURES; i++)CTestScene::CreateShaderResourceViews(pd3dDevice, m_pCloudTexture[i], 15, false);

	/*m_pCloudMaterial = new CMaterial(1);
	m_pCloudMaterial->SetTexture(m_pCloudTexture[0]);
	m_pCloudMaterial->SetShader(m_pCloudShader);
	SetMaterial(0, m_pCloudMaterial);*/

	//for (int i = 0; i < m_nInstance; ++i)
	//{
	//	//pInstanceInfos[i].m_xmf3Position = XMFLOAT3(i * 10, 2000, i * 10);
	//	//pInstanceInfos[i].m_xmf3Position = XMFLOAT3(410, 2000, -3000);
	//}

	/*m_pd3dInstancesBuffer = ::CreateBufferResource(pd3dDevice, pd3dCommandList, pInstanceInfos, sizeof(VS_VB_BILLBOARD_INSTANCE) * m_nInstance, D3D12_HEAP_TYPE_DEFAULT, D3D12_RESOURCE_STATE_VERTEX_AND_CONSTANT_BUFFER, &m_pd3dInstanceUploadBuffer);

	m_d3dInstancingBufferView.BufferLocation = m_pd3dInstancesBuffer->GetGPUVirtualAddress();
	m_d3dInstancingBufferView.StrideInBytes = sizeof(VS_VB_BILLBOARD_INSTANCE);
	m_d3dInstancingBufferView.SizeInBytes = sizeof(VS_VB_BILLBOARD_INSTANCE) * m_nInstance;

	if (pInstanceInfos) delete[] pInstanceInfos;*/
}

CCloud::~CCloud()
{
}

void CCloud::Animate(float fTimeElapsed)
{
}

void CCloud::SetLookAt(XMFLOAT3& xmfTarget)
{
}

void CCloud::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	m_pCloudShader->Render(pd3dCommandList, pCamera);
	m_pCloudMaterial->m_ppTextures[0]->UpdateShaderVariables(pd3dCommandList);
	m_pPlaneMesh->Render(pd3dCommandList, m_d3dInstancingBufferView, m_nInstance);
}
