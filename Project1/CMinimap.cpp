#include "stdafx.h"
#include "CMinimap.h"
#include "CPlaneMesh.h"
#include "CTestScene.h"

#define TEXTURES 6
CMinimap::CMinimap()
{}

CMinimap::CMinimap(int nIndex, ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth,
	XMFLOAT2 xmf2LeftTop, XMFLOAT2 xmf2LeftBot, XMFLOAT2 xmf2RightBot, XMFLOAT2 xmf2RightTop) : CPlane()
{
	m_pMinimapPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth, xmf2LeftTop, xmf2LeftBot, xmf2RightBot, xmf2RightTop, 1.0f, 1.0f);

	SetMesh(m_pMinimapPlaneMesh);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	//CTexture* m_ppUITexture[TEXTURES];


	m_ppMinimapTexture[0] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppMinimapTexture[0]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/MinimapUI.dds", 0);
	m_ppMinimapTexture[1] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppMinimapTexture[1]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/PauseMenu.dds", 0);
	m_ppMinimapTexture[2] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppMinimapTexture[2]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/TimeScoreUI2.dds", 0);
	m_ppMinimapTexture[3] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppMinimapTexture[3]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/MinimapPoint.dds", 0);
	m_ppMinimapTexture[4] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppMinimapTexture[4]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/MinimapRedPoint.dds", 0);
	m_ppMinimapTexture[5] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_ppMinimapTexture[5]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/Menuarrow.dds", 0);



	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);


	m_pMinimapShader = new CMinimapShader();

	m_pMinimapShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	m_pMinimapShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);


	for (int i = 0; i < TEXTURES; i++) CTestScene::CreateShaderResourceViews(pd3dDevice, m_ppMinimapTexture[i], 15, false);

	m_pMinimapMaterial = new CMaterial(1);
	m_pMinimapMaterial->SetTexture(m_ppMinimapTexture[nIndex]);
	m_pMinimapMaterial->SetShader(m_pMinimapShader);
	SetMaterial(0, m_pMinimapMaterial);
}

CMinimap::~CMinimap()
{
}

void CMinimap::Animate(float fTimeElapsed)
{
	if (m_fTimeElapsed == 0 && (GET_MANAGER<ObjectManager>()->GetTagFromObj(this, OBJ_MINIMAP_PLAYER) == L"MinimapInstance"
		|| GET_MANAGER<ObjectManager>()->GetTagFromObj(this, OBJ_MINIMAP_ENEMY) == L"MinimapInstance"))
		prePosition = GetPosition();

	//시간 이벤트를 위한 누적 시간
	m_fTimeElapsed += fTimeElapsed;

	if (m_fTimeElapsed >= 0.1f && (GET_MANAGER<ObjectManager>()->GetTagFromObj(this, OBJ_MINIMAP_PLAYER) == L"MinimapInstance"
		|| GET_MANAGER<ObjectManager>()->GetTagFromObj(this, OBJ_MINIMAP_ENEMY) == L"MinimapInstance"))
	{
		LookAt = GetPosition();
		m_fTimeElapsed = 0;
		/*cout << "플레이어 현 위치" << "( " << LookAt.x << ", " << LookAt.y << ", " << LookAt.z << " )" << endl;
		cout << endl;
		cout << "플레이어 전 위치" << "( " << prePosition.x << ", " << prePosition.y << ", " << prePosition.z << " )" << endl;
		cout << endl;	*/
	}

	SetLookAt(fTimeElapsed);
	//TextureAnimate();
}

void CMinimap::SetLookAt(float fTimeElapsed)
{
	XMFLOAT3 xmf3TargetVector = Vector3::Subtract(LookAt, prePosition);
	xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
	XMFLOAT3 xmfAxis = Vector3::CrossProduct(m_xmf3Up, xmf3TargetVector);
	xmfAxis = Vector3::Normalize(xmfAxis);
	Rotate(&xmfAxis, 2.f);
}

void CMinimap::MoveMinimapPoint(XMFLOAT3& xmfPlayer, CGameObject* pGameOBJ)
{
	float fx = 0.f;
	float fy = 0.f;

	float getx = 0.f;
	float gety = 0.f;

	getx = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui9_minimap", OBJ_MINIMAP_UI)->GetPosition().x;
	gety = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui9_minimap", OBJ_MINIMAP_UI)->GetPosition().y;

	fx = getx + (200.f / 20500.f) * xmfPlayer.x;
	fy = gety + (200.f / 20500.f) * xmfPlayer.z;

	if (fx >= getx + 200.f)
		this->SetIsRender(false);
	else if (fx <= getx - 200.f)
		this->SetIsRender(false);
	else
		this->SetIsRender(true);

	if (fy >= gety + 200.f)
		this->SetIsRender(false);
	else if (fy <= gety - 200.f)
		this->SetIsRender(false);
	else
		this->SetIsRender(true);

	pGameOBJ->SetPosition(fx, fy, 0.f);
}

void CMinimap::Rotate(XMFLOAT3* pxmf3Axis, float fAngle)
{
	if (pxmf3Axis->x == 0 && pxmf3Axis->y == 0 && pxmf3Axis->z == 0)
	{
		//cout << "zero" << endl;
		return;
	}

	//cout << "no zero" << endl;
	pxmf3Axis->z = -pxmf3Axis->z;

	XMMATRIX xmmtxRotate = XMMatrixRotationAxis(XMLoadFloat3(pxmf3Axis), XMConvertToRadians(fAngle));
	m_xmf3Look = Vector3::TransformNormal(m_xmf3Look, xmmtxRotate);
	m_xmf3Up = Vector3::TransformNormal(m_xmf3Up, xmmtxRotate);

	m_xmf4x4ToParent._31 = -m_xmf3Look.x;
	m_xmf4x4ToParent._32 = -m_xmf3Look.y;
	m_xmf4x4ToParent._33 = -m_xmf3Look.z;

	m_xmf4x4ToParent._21 = m_xmf3Up.x;
	m_xmf4x4ToParent._22 = m_xmf3Up.y;
	m_xmf4x4ToParent._23 = m_xmf3Up.z;

	m_xmf3Look = Vector3::Normalize(m_xmf3Look);
	m_xmf3Right = Vector3::CrossProduct(m_xmf3Up, m_xmf3Look, true);
	m_xmf3Up = Vector3::CrossProduct(m_xmf3Look, m_xmf3Right, true);

	m_xmf4x4ToParent._11 = m_xmf3Right.x;
	m_xmf4x4ToParent._12 = m_xmf3Right.y;
	m_xmf4x4ToParent._13 = m_xmf3Right.z;
}

void CMinimap::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera) {
	if (CGameObject::GetIsRender())
		CGameObject::Render(pd3dCommandList, pCamera);

}