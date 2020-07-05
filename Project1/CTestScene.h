#pragma once
#include "CScene.h"
#include "CPlayer.h"
#include "CSkyBox.h"
#include "CPlane.h"
#include "CUI.h"
#include "CLockOnUI.h"
#include "CHeightMapTerrain.h"
#include "CSuperCobraObject.h"

#define MAX_LIGHTS							16 

#define POINT_LIGHT							1
#define SPOT_LIGHT							2
#define DIRECTIONAL_LIGHT				3

struct LIGHT
{
	XMFLOAT4							m_xmf4Ambient;
	XMFLOAT4							m_xmf4Diffuse;
	XMFLOAT4							m_xmf4Specular;
	XMFLOAT3							m_xmf3Position;
	float 								m_fFalloff;
	XMFLOAT3							m_xmf3Direction;
	float 								m_fTheta; //cos(m_fTheta)
	XMFLOAT3							m_xmf3Attenuation;
	float								m_fPhi; //cos(m_fPhi)
	bool								m_bEnable;
	int									m_nType;
	float								m_fRange;
	float								padding;
};

struct LIGHTS
{
	LIGHT								m_pLights[MAX_LIGHTS];
	XMFLOAT4							m_xmf4GlobalAmbient;
	int									m_nLights;
};


class CMissleFog;
class CWater;
class CAfterBurner;
class CCloud;
class CTestScene : public CScene
{
public:
	CTestScene();
	~CTestScene();

	bool OnProcessingMouseMessage(HWND hWnd, UINT nMessageID, WPARAM wParam, LPARAM lParam);
	bool OnProcessingKeyboardMessage(HWND hWnd, UINT nMessageID, WPARAM wParam, LPARAM lParam);

	virtual void CreateShaderVariables(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList);
	virtual void UpdateShaderVariables(ID3D12GraphicsCommandList* pd3dCommandList);
	virtual void ReleaseShaderVariables();

	void BuildDefaultLightsAndMaterials();
	void BuildObjects(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList);
	void CreateStageObject();
	void ReleaseObjects();

	bool ProcessInput(UCHAR* pKeysBuffer);
	void AnimateObjects(float fTimeElapsed);

	void OnPrepareRender(ID3D12GraphicsCommandList* pd3dCommandList);
	virtual void OnPreRender(ID3D12Device* pd3dDevice, ID3D12CommandQueue* pd3dCommandQueue, ID3D12Fence* pd3dFence, HANDLE hFenceEvent);

	void Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera = NULL, bool bPreRender = false, ID3D12Resource* pCurrentBackBuffer = NULL);

	void ReleaseUploadBuffers();

public:
	float fx, fy = 0.f;
	float m_fElapsedTime = 0.f;
	bool m_bCreateShip = false;
	bool m_bCreateEngineRefraction = true;
	float elapsedTime = 0;


	int									m_nGameObjects = 0;
	CGameObject** m_ppGameObjects = NULL;

	int									m_nShaders = 0;
	CShader** m_ppShaders = NULL;

	CSkyBox* m_pSkyBox = NULL;
	CBlur* m_pBlur = NULL;

	CHeightMapTerrain* m_pTerrain = NULL;

	LIGHT* m_pLights = NULL;
	int									m_nLights = 0;

	XMFLOAT4							m_xmf4GlobalAmbient;

	ID3D12Resource* m_pd3dcbLights = NULL;
	LIGHTS* m_pcbMappedLights = NULL;

	int									m_nHierarchicalGameObjects = 0;
	CGameObject** m_ppHierarchicalGameObjects = NULL;

	CWater* m_pWater[18];

	CGameTimer					m_GameTimer;

	bool quadrant1 = false;
	bool quadrant2 = false;
	bool quadrant3 = false;
	bool quadrant4 = false;

	int RotateMode = 0;


};

