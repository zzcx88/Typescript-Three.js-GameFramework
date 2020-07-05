#include "stdafx.h"
#include "CNavigator.h"
#include "CNavMesh.h"
#include "CTestScene.h"
#include "CShaderManager.h"

CNavigator::CNavigator(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature) : CGameObject(1)
{
	//CNavMesh* pBoxMesh = new CNavMesh(pd3dDevice, pd3dCommandList, 2.0f, 2.0f, 2.0f);
	m_pNavMesh = new CNavMesh(pd3dDevice, pd3dCommandList, 0.17f, 0.17f, 1.2f);
	SetMesh(m_pNavMesh);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	//CTexture* pBoxTexture = 
	m_pNavTexture[0] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pNavTexture[0]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"UI/RedLine.dds", 0);

	m_pNavShader = new CRedUIShader();
	m_pNavShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	m_pNavShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);
	
	CTestScene::CreateShaderResourceViews(pd3dDevice, m_pNavTexture[0], 15, false);

	m_pNavMaterial = new CMaterial(1);
	m_pNavMaterial->SetTexture(m_pNavTexture[0]);
	m_pNavMaterial->SetShader(m_pNavShader);

	SetMaterial(0, m_pNavMaterial);
}

CNavigator::~CNavigator()
{
}

void CNavigator::Animate(float fTimeElapsed)
{
	GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player_ui16_navigator" , OBJ_NAVIGATOR)->SetPosition(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().x, GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().y+1.f, GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition().z );

	//cout << GetPosition().x << ", " << GetPosition().y << ", " << GetPosition().z<< endl;
	for (auto& Ene : GET_MANAGER<ObjectManager>()->GetObjFromType(OBJ_ENEMY))
	{
		if (Ene.second->m_bAiming == true && Ene.second->GetState() != true)
		{
			m_xmf3FixTarget = Ene.second->GetPosition();
			SetLookAt(m_xmf3FixTarget);
			//NevSetLookAt(m_xmf3FixTarget);
		}
	}

}
void CNavigator::Rotate(XMFLOAT3* pxmf3Axis, float fAngle)
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

	m_xmf4x4ToParent._31 = m_xmf3Look.x;
	m_xmf4x4ToParent._32 = m_xmf3Look.y;
	m_xmf4x4ToParent._33 = m_xmf3Look.z;

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
void CNavigator::SetLookAt(XMFLOAT3& xmfTarget)
{
	//m_xmf3Right = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_xmf3Right;
	//m_xmf3Up = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_xmf3Up;
	//m_xmf3Look = GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_xmf3Look;
	//
	XMFLOAT3 xmfUp(0.0f, 1.0f, 0.0f);
	XMFLOAT3 xmfLook(0.0f, 0.0f, 1.0f);

	XMFLOAT4X4 mtxLookAt = Matrix4x4::LookAtLH( xmfTarget, GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition(), xmfUp);
	m_xmf3Right = XMFLOAT3(mtxLookAt._11, mtxLookAt._21, mtxLookAt._31);
	m_xmf3Up = XMFLOAT3(mtxLookAt._12, mtxLookAt._22, mtxLookAt._32);
	m_xmf3Look = XMFLOAT3(mtxLookAt._13, mtxLookAt._23, mtxLookAt._33);

	m_xmf4x4ToParent._11 = m_xmf3Right.x;			m_xmf4x4ToParent._12 = m_xmf3Right.y;		m_xmf4x4ToParent._13 = m_xmf3Right.z;
	m_xmf4x4ToParent._21 = m_xmf3Up.x;			m_xmf4x4ToParent._22 = m_xmf3Up.y;		m_xmf4x4ToParent._23 = m_xmf3Up.z;
	m_xmf4x4ToParent._31 = m_xmf3Look.x;		m_xmf4x4ToParent._32 = m_xmf3Look.y;	m_xmf4x4ToParent._33 = m_xmf3Look.z;

	XMFLOAT3 xmf3TargetVector = Vector3::Subtract(xmfTarget, GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition());
	xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
	float xmfAxis = Vector3::DotProduct(GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera->GetLookVector(), xmf3TargetVector);
	
	if (xmfAxis < 0.85)
		SetIsRender(true);
	else
		SetIsRender(false);
}

void CNavigator::NevSetLookAt(XMFLOAT3& xmf3LookAt)
{
	XMFLOAT3 xmf3TargetVector = Vector3::Subtract(xmf3LookAt, GET_MANAGER<ObjectManager>()->GetObjFromTag(L"player", OBJ_PLAYER)->GetPosition());
	xmf3TargetVector = Vector3::Normalize(xmf3TargetVector);
	XMFLOAT3 xmfAxis = Vector3::CrossProduct(m_xmf3Look, xmf3TargetVector);
	xmfAxis = Vector3::Normalize(xmfAxis);
	Rotate(&xmfAxis, 2.f);
}

void CNavigator::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	if (CGameObject::GetIsRender())
		CGameObject::Render(pd3dCommandList, pCamera);

}