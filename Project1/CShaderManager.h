#pragma once
#include "CGameObject.h"
#include "CCamera.h"
class CShader
{
public:
	CShader();
	virtual ~CShader();

private:
	int									m_nReferences = 0;
	
public:
	void AddRef() { m_nReferences++; }
	void Release() { if (--m_nReferences <= 0) delete this; }

	virtual D3D12_INPUT_LAYOUT_DESC CreateInputLayout();
	virtual D3D12_RASTERIZER_DESC CreateRasterizerState();
	virtual D3D12_BLEND_DESC CreateBlendState();
	virtual D3D12_DEPTH_STENCIL_DESC CreateDepthStencilState();

	virtual D3D12_SHADER_BYTECODE CreateVertexShader();
	virtual D3D12_SHADER_BYTECODE CreatePixelShader();
	virtual D3D12_SHADER_BYTECODE CreateComputeShaderH();
	virtual D3D12_SHADER_BYTECODE CreateComputeShaderV();

	D3D12_SHADER_BYTECODE CompileShaderFromFile(WCHAR* pszFileName, LPCSTR pszShaderName, LPCSTR pszShaderProfile, ID3DBlob** ppd3dShaderBlob);
	D3D12_SHADER_BYTECODE ReadCompiledShaderFromFile(WCHAR* pszFileName, ID3DBlob** ppd3dShaderBlob = NULL);

	virtual void CreateShader(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
	virtual void CreateHShader(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
	virtual void CreateVShader(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);

    virtual void CreateShaderVariables(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList) { }
	virtual void UpdateShaderVariables(ID3D12GraphicsCommandList* pd3dCommandList) { }
	virtual void ReleaseShaderVariables() { }

	virtual void UpdateShaderVariable(ID3D12GraphicsCommandList* pd3dCommandList, XMFLOAT4X4* pxmf4x4World) { }

	virtual void OnPrepareRender(ID3D12GraphicsCommandList* pd3dCommandList, int nPipelineState=0);
	virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);

	virtual void ReleaseUploadBuffers() { }

	virtual void BuildObjects(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, CLoadedModelInfo* pModel, void* pContext = NULL) { }
	virtual void AnimateObjects(float fTimeElapsed) { }
	virtual void ReleaseObjects() { }

	ID3D12PipelineState* GetHorzPipelineState() const;
	ID3D12PipelineState* GetVertPipelineState() const;

protected:
	
	ID3DBlob* m_pd3dVertexShaderBlob = NULL;
	ID3DBlob* m_pd3dPixelShaderBlob = NULL;
	ID3DBlob* m_pd3dComputeShaderHBlob = NULL;
	ID3DBlob* m_pd3dComputeShaderVBlob = NULL;

	ID3D12PipelineState* m_pd3dPipelineState = NULL;
	ID3D12PipelineState* m_pd3dHorzBlurPipelineState = NULL;
	ID3D12PipelineState* m_pd3dVertBlurPipelineState = NULL;
	
	D3D12_GRAPHICS_PIPELINE_STATE_DESC m_d3dPipelineStateDesc;
	D3D12_COMPUTE_PIPELINE_STATE_DESC m_d3dComputeBlurHPipelineStateDesc;
	D3D12_COMPUTE_PIPELINE_STATE_DESC m_d3dComputeBlurVPipelineStateDesc;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
class CTerrainShader : public CShader
{
public:
	CTerrainShader();
	virtual ~CTerrainShader();

	virtual D3D12_INPUT_LAYOUT_DESC CreateInputLayout();

	virtual D3D12_SHADER_BYTECODE CreateVertexShader();
	virtual D3D12_SHADER_BYTECODE CreatePixelShader();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
class CSkyBoxShader : public CShader
{
public:
	CSkyBoxShader();
	virtual ~CSkyBoxShader();

	virtual D3D12_INPUT_LAYOUT_DESC CreateInputLayout();
	virtual D3D12_DEPTH_STENCIL_DESC CreateDepthStencilState();

	virtual D3D12_SHADER_BYTECODE CreateVertexShader();
	virtual D3D12_SHADER_BYTECODE CreatePixelShader();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
class CStandardShader : public CShader
{
public:
	CStandardShader();
	virtual ~CStandardShader();

	virtual D3D12_INPUT_LAYOUT_DESC CreateInputLayout();

	virtual D3D12_SHADER_BYTECODE CreateVertexShader();
	virtual D3D12_SHADER_BYTECODE CreatePixelShader();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
class CObjectsShader : public CStandardShader
{
public:
	CObjectsShader();
	virtual ~CObjectsShader();

	virtual void BuildObjects(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, void* pContext = NULL);
	virtual void AnimateObjects(float fTimeElapsed);
	virtual void ReleaseObjects();

	virtual void ReleaseUploadBuffers();

	virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera);

protected:
	CGameObject** m_ppObjects = 0;
	int								m_nObjects = 0;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
class CPlayerShader : public CStandardShader
{
public:
	CPlayerShader();
	virtual ~CPlayerShader();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
class CSkinnedAnimationShader : public CStandardShader
{
public:
	CSkinnedAnimationShader();
	virtual ~CSkinnedAnimationShader();

	virtual D3D12_INPUT_LAYOUT_DESC CreateInputLayout();

	virtual D3D12_SHADER_BYTECODE CreateVertexShader();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
class CAceModelShader : public CStandardShader
{
public:
	CAceModelShader() {}
	virtual ~CAceModelShader() {}

	virtual D3D12_RASTERIZER_DESC CreateRasterizerState();
};


class CColliderShader : public CStandardShader
{
public:
	CColliderShader() {}
	virtual ~CColliderShader() {}

	virtual D3D12_RASTERIZER_DESC CreateRasterizerState();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//

class CPlaneShader : public CShader
{
public:
	ID3D12Resource* m_pd3dcbGameObjects = NULL;

public:
	CPlaneShader();
	virtual ~CPlaneShader();

	virtual D3D12_INPUT_LAYOUT_DESC CreateInputLayout();

	virtual D3D12_SHADER_BYTECODE CreateVertexShader();
	virtual D3D12_SHADER_BYTECODE CreatePixelShader();

	virtual D3D12_RASTERIZER_DESC CreateRasterizerState();

	virtual D3D12_BLEND_DESC CreateBlendState();

	void CreateConstantBufferViews(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, int nConstantBufferViews, ID3D12Resource* pd3dConstantBuffers, UINT nStride);
};

class CMissleFogShader : public CShader
{
	public:
		ID3D12Resource* m_pd3dcbGameObjects = NULL;

	public:
		CMissleFogShader();
		virtual ~CMissleFogShader();

		virtual D3D12_INPUT_LAYOUT_DESC CreateInputLayout();

		virtual D3D12_SHADER_BYTECODE CreateVertexShader();
		virtual D3D12_SHADER_BYTECODE CreatePixelShader();

		virtual D3D12_RASTERIZER_DESC CreateRasterizerState();

		virtual D3D12_BLEND_DESC CreateBlendState();

		void CreateConstantBufferViews(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, int nConstantBufferViews, ID3D12Resource* pd3dConstantBuffers, UINT nStride);
};

class CWaterShader : public CShader
{
public:
	ID3D12Resource* m_pd3dcbGameObjects = NULL;

public:
	CWaterShader();
	virtual ~CWaterShader();

	virtual D3D12_INPUT_LAYOUT_DESC CreateInputLayout();

	virtual D3D12_SHADER_BYTECODE CreateVertexShader();
	virtual D3D12_SHADER_BYTECODE CreatePixelShader();

	virtual D3D12_RASTERIZER_DESC CreateRasterizerState();

	virtual D3D12_BLEND_DESC CreateBlendState();

	void CreateConstantBufferViews(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, int nConstantBufferViews, ID3D12Resource* pd3dConstantBuffers, UINT nStride);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//

class CBlurHShader : public CShader {

public:
	CBlurHShader();
	virtual ~CBlurHShader();

	virtual D3D12_SHADER_BYTECODE CreateComputeShaderH();
	//virtual void CreateHShader(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);

	//virtual void OnPrepareRender(ID3D12GraphicsCommandList* pd3dCommandList, int nPipelineState = 0);
	//virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList);
};

class CBlurVShader : public CShader {

public:
	CBlurVShader();
	virtual ~CBlurVShader();

	virtual D3D12_SHADER_BYTECODE CreateComputeShaderV();
	/*virtual void CreateVShader(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);

	virtual void OnPrepareRender(ID3D12GraphicsCommandList* pd3dCommandList, int nPipelineState = 0);
	virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList);*/
};