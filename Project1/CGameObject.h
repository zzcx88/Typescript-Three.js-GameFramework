#pragma once
#include "CMesh.h"
#include "CAnimationController.h"

class CShader;
class CStandardShader;

struct SRVROOTARGUMENTINFO
{
	int														m_nRootParameterIndex = 0;
	D3D12_GPU_DESCRIPTOR_HANDLE		m_d3dSrvGpuDescriptorHandle;
};

class CTexture
{
public:
	CTexture(int nTextureResources = 1, UINT nResourceType = RESOURCE_TEXTURE2D, int nSamplers = 0);
	virtual ~CTexture();

private:
	int								m_nReferences = 0;

	UINT							m_nTextureType = RESOURCE_TEXTURE2D;

	int								m_nTextures = 0;
	ID3D12Resource** m_ppd3dTextures = NULL;
	ID3D12Resource** m_ppd3dTextureUploadBuffers;

	int								m_nSamplers = 0;
	D3D12_GPU_DESCRIPTOR_HANDLE* m_pd3dSamplerGpuDescriptorHandles = NULL;

public:
	SRVROOTARGUMENTINFO* m_pRootArgumentInfos = NULL;

public:
	void AddRef() { m_nReferences++; }
	void Release() { if (--m_nReferences <= 0) delete this; }

	void SetRootArgument(int nIndex, UINT nRootParameterIndex, D3D12_GPU_DESCRIPTOR_HANDLE d3dsrvGpuDescriptorHandle);
	void SetSampler(int nIndex, D3D12_GPU_DESCRIPTOR_HANDLE d3dSamplerGpuDescriptorHandle);

	void UpdateShaderVariables(ID3D12GraphicsCommandList* pd3dCommandList);
	void UpdateShaderVariable(ID3D12GraphicsCommandList* pd3dCommandList, int nIndex);
	void ReleaseShaderVariables();

	void LoadTextureFromFile(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, wchar_t* pszFileName, UINT nIndex, bool bIsDDSFile = true);

	int GetTextures() { return(m_nTextures); }
	ID3D12Resource* GetTexture(int nIndex) { return(m_ppd3dTextures[nIndex]); }
	UINT GetTextureType() { return(m_nTextureType); }

	void ReleaseUploadBuffers();
};

class CMaterial
{
public:
	CMaterial(int nTextures);
	virtual ~CMaterial();

private:
	int								m_nReferences = 0;

public:
	void AddRef() { m_nReferences++; }
	void Release() { if (--m_nReferences <= 0) delete this; }

public:
	//CTexture* m_pTexture = NULL;
	CShader* m_pShader = NULL;

	XMFLOAT4						m_xmf4AlbedoColor = XMFLOAT4(1.0f, 1.0f, 1.0f, 1.0f);
	XMFLOAT4						m_xmf4EmissiveColor = XMFLOAT4(0.0f, 0.0f, 0.0f, 1.0f);
	XMFLOAT4						m_xmf4SpecularColor = XMFLOAT4(0.0f, 0.0f, 0.0f, 1.0f);
	XMFLOAT4						m_xmf4AmbientColor = XMFLOAT4(0.0f, 0.0f, 0.0f, 1.0f);

	void SetShader(CShader* pShader);
	void SetMaterialType(UINT nType) { m_nType |= nType; }
	void SetTexture(CTexture* pTexture, UINT nTexture = 0);

	virtual void UpdateShaderVariable(ID3D12GraphicsCommandList* pd3dCommandList);

	virtual void ReleaseUploadBuffers();

public:
	UINT							m_nType = 0x00;

	float							m_fGlossiness = 0.0f;
	float							m_fSmoothness = 0.0f;
	float							m_fSpecularHighlight = 0.0f;
	float							m_fMetallic = 0.0f;
	float							m_fGlossyReflection = 0.0f;

public:
	int 							m_nTextures = 0;
	_TCHAR(*m_ppstrTextureNames)[64] = NULL;
	CTexture** m_ppTextures = NULL; //0:Albedo, 1:Specular, 2:Metallic, 3:Normal, 4:Emission, 5:DetailAlbedo, 6:DetailNormal

	void LoadTextureFromFile(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, UINT nType, UINT nRootParameter, _TCHAR* pwstrTextureName, CTexture** ppTexture, CGameObject* pParent, FILE* pInFile, CShader* pShader);

public:
	static CShader* m_pStandardShader;
	static CShader* m_pAceSahder;
	static CShader* m_pSkinnedAnimationShader;
	static CShader* m_pColliderShader;

	static void CMaterial::PrepareShaders(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);

	void SetStandardShader() { CMaterial::SetShader(m_pStandardShader); }
	void SetAceModelShader() { CMaterial::SetShader(m_pAceSahder); }
	void SetSkinnedAnimationShader() { CMaterial::SetShader(m_pSkinnedAnimationShader); }
	void SetColliderShader() { CMaterial::SetShader(m_pColliderShader); }

	CShader* GetShader() { return m_pAceSahder; }
};


struct CB_GAMEOBJECT_INFO
{
	XMFLOAT4X4						m_xmf4x4World;
	UINT								m_nMaterial;
};

class CSphereCollider;
class CMissleFogShader;
class CUIShader;
class CWaterShader;
class CPlaneMesh;
class CUI;
class CLockOnUI;
class CAfterBurner;
class CGameObject
{
private:
	int								m_nReferences = 0;

public:
	void AddRef();
	void Release();

public:
	CGameObject();
	CGameObject(int nMaterials);
	virtual ~CGameObject();

protected:
	ID3D12Resource* m_pd3dcbGameObject = NULL;
	//CB_GAMEOBJECT_INFO* m_pcbMappedGameObject = NULL;

public:
	char							m_pstrFrameName[64];

	CMesh* m_pMesh = NULL;
	//CMesh** m_ppMeshes = NULL;

	int								m_nObjects = 0;
	int								m_nMaterials = 0;
	CMaterial** m_ppMaterials = NULL;
	
	////////////////////////////////////////
	//Effect Attribute
public:
	CMaterial* m_pEffectMaterial;
	CPlaneMesh* m_pPlaneMesh;
	CTexture* m_pEffectTexture[20];
	CMissleFogShader* m_EffectShader;
	CAfterBurner* m_pAfterBurner = NULL;
///////////////////////////////////////////

	CPlaneMesh* m_pUIPlaneMesh;
	CUIShader* m_pUIShader;
	CMaterial* m_pUIMaterial;
	CTexture* m_ppUITexture[10];
	///////////////////////////////////////////
	CPlaneMesh* m_pLockOnUIPlaneMesh;

	CUIShader* m_pLockOnUIShader;
	CMaterial* m_pLockOnUIMaterial;
	CTexture* m_ppLockOnUITexture[2];
	///////////////////////////////////////////

	XMFLOAT4X4						m_xmf4x4ToParent;
	XMFLOAT4X4						m_xmf4x4World;

	CGameObject* m_pParent = NULL;
	CGameObject* m_pChild = NULL;
	CGameObject* m_pSibling = NULL;

	CSphereCollider* SphereCollider = NULL;

	CUI*						m_pUI = NULL;
	CLockOnUI*			m_pLockOnUI = NULL;
	int m_iDistanceFromPlayer = 0;
	bool bLockOn = false;
	bool bLockOnFire = false;

	OBJTYPE				m_ObjType = OBJ_END;

	bool			m_isDead = false;

	void SetMesh(CMesh* pMesh);
	//void SetMesh(int nIndex, CMesh* pMesh);
	void SetShader(CShader* pShader);
	void SetShader(int nMaterial, CShader* pShader);
	void SetMaterial(int nMaterial, CMaterial* pMaterial);
	void SetObjectType(OBJTYPE type);

	void SetChild(CGameObject* pChild, bool bReferenceUpdate = false);

	virtual void BuildMaterials(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList) { }

	virtual void OnPrepareAnimate() { }
	virtual void Animate(float fTimeElapsed);
	virtual void Animate(float fTimeElapsed, DWORD Direction) {}

	virtual void CollisionActivate(CGameObject* collideTarget);

	virtual void OnPrepareRender() { }
	virtual void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera = NULL);

	virtual void CreateShaderVariables(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList);
	virtual void UpdateShaderVariables(ID3D12GraphicsCommandList* pd3dCommandList);
	virtual void ReleaseShaderVariables();

	virtual void UpdateShaderVariable(ID3D12GraphicsCommandList* pd3dCommandList, XMFLOAT4X4* pxmf4x4World);
	virtual void UpdateShaderVariable(ID3D12GraphicsCommandList* pd3dCommandList, CMaterial* pMaterial);

	virtual void ReleaseUploadBuffers();

	XMFLOAT2 m_xmpScreenPosition;
	XMFLOAT3 GetPosition();
	XMFLOAT2 GetScreenPosition();
	XMFLOAT3* GetPositionForMissle();
	XMFLOAT3* m_xmpPosition = NULL;
	XMFLOAT3 m_positionForMissle;
	XMFLOAT3 GetLook();
	XMFLOAT3 GetUp();
	XMFLOAT3 GetRight();

	const bool& GetState() { return m_isDead; }

	void SetPosition(float x, float y, float z);
	void SetPosition(XMFLOAT3 xmf3Position);
	void SetScale(float x, float y, float z);

	void MoveStrafe(float fDistance = 1.0f);
	void MoveUp(float fDistance = 1.0f);
	void MoveForward(float fDistance = 1.0f);

	void Rotate(float fPitch = 10.0f, float fYaw = 10.0f, float fRoll = 10.0f);
	void Rotate(XMFLOAT3* pxmf3Axis, float fAngle);
	void Rotate(XMFLOAT4* pxmf4Quaternion);

	CGameObject* GetParent() { return(m_pParent); }
	void UpdateTransform(XMFLOAT4X4* pxmf4x4Parent = NULL);
	CGameObject* FindFrame(char* pstrFrameName);

	CTexture* FindReplicatedTexture(_TCHAR* pstrTextureName);

	UINT GetMeshType() { return((m_pMesh) ? m_pMesh->GetType() : 0x00); }

	CShader* GetShader();

	void SetScreenPos(XMFLOAT3& xmfTarget, CCamera* pCamera);

	bool operator ==(const CGameObject& a)const
	{
		return m_iDistanceFromPlayer == a.m_iDistanceFromPlayer;
	}
	/*
	bool operator !=(const CGameObject& a)const
	{
		return !(*this == a);
	}*/

	bool operator <(const CGameObject& a) const
	{
		//if (m_iDistanceFromPlayer == a.m_iDistanceFromPlayer)
			//return m_xmpPosition->x < a.m_xmpPosition->x;

		//if (m_iDistanceFromPlayer != a.m_iDistanceFromPlayer)
		return m_iDistanceFromPlayer < a.m_iDistanceFromPlayer;
		
	}

public:
	CAnimationController* m_pSkinnedAnimationController = NULL;

	CSkinnedMesh* FindSkinnedMesh(char* pstrSkinnedMeshName);
	void FindAndSetSkinnedMesh(CSkinnedMesh** ppSkinnedMeshes, int* pnSkinnedMesh);

	void SetTrackAnimationSet(int nAnimationTrack, int nAnimationSet);
	void SetTrackAnimationPosition(int nAnimationTrack, float fPosition);

	void LoadMaterialsFromFile(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, CGameObject* pParent, FILE* pInFile, CShader* pShader, MODELTYPE modelType);

	static void LoadAnimationFromFile(FILE* pInFile, CLoadedModelInfo* pLoadedModel);
	static CGameObject* LoadFrameHierarchyFromFile(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, CGameObject* pParent, FILE* pInFile, CShader* pShader, int* pnSkinnedMeshes, MODELTYPE modelType);

	static CLoadedModelInfo* LoadGeometryAndAnimationFromFile(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, char* pstrFileName, CShader* pShader, MODELTYPE modelType);

	static void PrintFrameInfo(CGameObject* pGameObject, CGameObject* pParent);


};