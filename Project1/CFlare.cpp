#include "stdafx.h"
#include "CFlare.h"
#include "CPlaneMesh.h"
#include "CTestScene.h"
#include "CShaderManager.h"
#include "CMissleFog.h"

CFlare::CFlare(XMFLOAT3 xmf3LaunchedUpVector)
{
	m_xmf3LaunchedUpVector = xmf3LaunchedUpVector;
	m_xmf3LaunchedUpVector = XMFLOAT3(m_xmf3LaunchedUpVector.x * -1, m_xmf3LaunchedUpVector.y * -1, m_xmf3LaunchedUpVector.z * -1);

	m_ObjManager = GET_MANAGER<ObjectManager>();
	m_pCamera = m_ObjManager->GetObjFromTag(L"player", OBJ_PLAYER)->m_pCamera;
	m_xmf3Up = XMFLOAT3(0, 1, 0);
}

CFlare::CFlare(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature, float fWidth, float fHeight, float fDepth)
{
	m_bReffernce = true;
	m_fBurnerBlendAmount = 1;
	m_pPlaneMesh = new CPlaneMesh(pd3dDevice, pd3dCommandList, fWidth, fHeight, fDepth, XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0), XMFLOAT2(0, 0));

	SetMesh(m_pPlaneMesh);

	CreateShaderVariables(pd3dDevice, pd3dCommandList);

	//m_pEffectTexture[TEXTURES];
	m_pTexture = new CTexture(1, RESOURCE_TEXTURE2D, 0);
	m_pTexture->LoadTextureFromFile(pd3dDevice, pd3dCommandList, L"Effect/Flare.dds", 0);

	UINT ncbElementBytes = ((sizeof(CB_GAMEOBJECT_INFO) + 255) & ~255);
	m_pShader = new CMissleFogShader();

	m_pShader->CreateShader(pd3dDevice, pd3dCommandList, pd3dGraphicsRootSignature);
	m_pShader->CreateShaderVariables(pd3dDevice, pd3dCommandList);

	//m_pShader->CreateConstantBufferViews(pd3dDevice, pd3dCommandList, m_nObjects, m_pShader->m_pd3dcbBlendAmount, ncbElementBytes);

	CTestScene::CreateShaderResourceViews(pd3dDevice, m_pTexture, 15, false);

	m_pMaterial = new CMaterial(1);
	m_pMaterial->SetTexture(m_pTexture);
	m_pMaterial->SetShader(m_pShader);

	SetMaterial(0, m_pMaterial);
}

CFlare::~CFlare()
{
}

void CFlare::Animate(float fTimeElapsed)
{
	m_xmf3Position.x = m_xmf4x4ToParent._41;
	m_xmf3Position.y = m_xmf4x4ToParent._42;
	m_xmf3Position.z = m_xmf4x4ToParent._43;

	m_fAddCrushFogTimeElapsed += fTimeElapsed;
	m_DeleteElapsed += 1.f * fTimeElapsed;
	if (!m_bReffernce)
	{
		
		if (m_DeleteElapsed > m_fDeleteFrequence)
		{
			m_isDead = true;
		}
		if (m_fAddCrushFogTimeElapsed > m_fAddCrushFogFrequence)
		{
			CMissleFog* pMissleFog;
			pMissleFog = new CMissleFog();
			pMissleFog->m_fBurnerBlendAmount = 0.8f;
			pMissleFog->m_pCamera = m_pCamera;
			pMissleFog->SetMesh(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pPlaneMesh);
			pMissleFog->m_pEffectMaterial = new CMaterial(1);
			pMissleFog->m_pEffectMaterial->SetTexture(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_pEffectTexture[0]);
			pMissleFog->m_pEffectMaterial->SetShader(m_ObjManager->GetObjFromTag(L"MissleFog", OBJ_EFFECT)->m_EffectShader);
			pMissleFog->SetMaterial(0, pMissleFog->m_pEffectMaterial);
			pMissleFog->SetPosition(m_xmf3Position);
			pMissleFog->m_bEffectedObj = true;
			pMissleFog->m_bFlareFog = true;
			m_ObjManager->AddObject(L"MissleFogInstance", pMissleFog, OBJ_EFFECT);

			m_fAddCrushFogTimeElapsed = 0;
		}
		//Move(DIR_FORWARD, m_fFlareSpeed * fTimeElapsed, false);
		XMFLOAT3 xmf3Shift = XMFLOAT3(0, 0, 0);
		xmf3Shift = Vector3::Add(xmf3Shift, m_xmf3LaunchedUpVector, 50 * fTimeElapsed);
		xmf3Shift = Vector3::Add(xmf3Shift,m_xmf3Look, (m_fFlareSpeed + 500) * fTimeElapsed);
		xmf3Shift = Vector3::Add(xmf3Shift, m_xmf3Up, -50 * fTimeElapsed);
		Move(xmf3Shift, false);
		SetLookAt(m_pCamera->GetPosition());
		CGameObject::Animate(fTimeElapsed);
		Deceptioning();
	}
}

void CFlare::TextureAnimate()
{
}

void CFlare::SetLookAt(XMFLOAT3& xmfTarget)
{
	XMFLOAT3 xmfUp(0.0f, 1.0f, 0.0f);
	XMFLOAT4X4 mtxLookAt = Matrix4x4::LookAtLH(xmfTarget, m_xmf3Position, xmfUp);
	m_xmf3Right = XMFLOAT3(mtxLookAt._11, mtxLookAt._21, mtxLookAt._31);
	m_xmf3Up = XMFLOAT3(mtxLookAt._12, mtxLookAt._22, mtxLookAt._32);
	m_xmf3Look = XMFLOAT3(mtxLookAt._13, mtxLookAt._23, mtxLookAt._33);
	m_xmf4x4ToParent._11 = m_xmf3Right.x;			m_xmf4x4ToParent._12 = m_xmf3Right.y;		m_xmf4x4ToParent._13 = m_xmf3Right.z;
	m_xmf4x4ToParent._21 = m_xmf3Up.x;			m_xmf4x4ToParent._22 = m_xmf3Up.y;		m_xmf4x4ToParent._23 = m_xmf3Up.z;
	m_xmf4x4ToParent._31 = m_xmf3Look.x;		m_xmf4x4ToParent._32 = m_xmf3Look.y;	m_xmf4x4ToParent._33 = m_xmf3Look.z;
}

void CFlare::Deceptioning()
{
	XMFLOAT3 xmf3Pos, xmf3MisslePos, xmf3TargetVector;
	float LenthToMissile;
	if (m_FromType == OBJ_ENEMY)
	{
		for (auto& obj : GET_MANAGER<ObjectManager>()->GetObjFromType(OBJ_ALLYMISSLE))
		{
			xmf3Pos = GetPosition();
			xmf3MisslePos = obj.second->GetPosition();
			xmf3TargetVector = Vector3::Subtract(xmf3Pos, xmf3MisslePos);
			LenthToMissile = Vector3::Length(xmf3TargetVector);

			if (LenthToMissile < 800)
			{
				CMissle* pMissile = (CMissle*)obj.second;
				if (pMissile->m_xmfTarget != NULL)
				{
					pMissile->m_xmfTarget = GetPositionForMissle();
				}
			}
		}
	}
	else if (m_FromType == OBJ_PLAYER)
	{
		for (auto& obj : GET_MANAGER<ObjectManager>()->GetObjFromType(OBJ_ENEMISSLE))
		{
			xmf3Pos = GetPosition();
			xmf3MisslePos = obj.second->GetPosition();
			xmf3TargetVector = Vector3::Subtract(xmf3Pos, xmf3MisslePos);
			LenthToMissile = Vector3::Length(xmf3TargetVector);

			if (LenthToMissile < 1200)
			{
				CMissle* pMissile = (CMissle*)obj.second;
				if (pMissile->m_xmfTarget != NULL)
				{
					pMissile->m_xmfTarget = GetPositionForMissle();
				}
			}
		}
	}
}

void CFlare::Render(ID3D12GraphicsCommandList* pd3dCommandList, CCamera* pCamera)
{
	if (m_bReffernce == false)
	{
		CGameObject::Render(pd3dCommandList, pCamera);
	}
}
