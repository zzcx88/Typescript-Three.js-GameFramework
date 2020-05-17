#include "stdafx.h"
#include "CMotionBlur.h"



MOTION_BLUR::MOTION_BLUR(LPDIRECT3DDEVICE9 pd3dDevice, D3DPRESENT_PARAMETERS* pd3dParameters) : D3D2DSQUARE(pd3dDevice, pd3dParameters)
{
    m_pd3dDevice = pd3dDevice;
    m_pd3dParameters = pd3dParameters;
    m_pEffect = NULL;
}

MOTION_BLUR :: ~MOTION_BLUR()
{
    // SafeRelease는 함수가 아니라 매크로
    // # define SafeRelease (x) {if (x) {(x) -> Release (); (x) = NULL;}}
    SafeRelease(m_pEffect);
}

// 장치가 분실했을 때 호출하는 함수
void MOTION_BLUR::Invalidate()
{
    if (m_pEffect)
        m_pEffect->OnLostDevice();
}

// 장치가 복원 될 때 호출하는 함수
void MOTION_BLUR::Restore()
{
    if (m_pEffect)
        m_pEffect->OnResetDevice();
}

HRESULT MOTION_BLUR::Load()
{
    D3DCAPS9 caps;
    HRESULT hr;

    m_pd3dDevice->GetDeviceCaps(&caps);
    if (caps.VertexShaderVersion > = D3DVS_VERSION(1, 1) && caps.PixelShaderVersion > = D3DPS_VERSION(3, 0))
    {
        hr = D3D2DSQUARE::Load();
        if (FAILED(hr))
            return -1;

        // 쉐이더의 초기화
        LPD3DXBUFFER pErr = NULL;
        hr = D3DXCreateEffectFromFile(m_pd3dDevice, _T("MotionBlur.fx"), NULL, NULL, 0, NULL, &m_pEffect & pErr);
        if (FAILED(hr))
            return -2;

        m_pTechnique = m_pEffect->GetTechniqueByName("TShader");
        m_pWVPNew = m_pEffect->GetParameterByName(NULL, "m_WVPNew");
        m_pWVPOld = m_pEffect->GetParameterByName(NULL, "m_WVPOld");
        m_pROnly = m_pEffect->GetParameterByName(NULL, "m_ROnly");

        m_pEffect->SetTechnique(m_pTechnique);
    }

    else
    {
        return -3;
    }

    return S_OK;
}

void MOTION_BLUR::Step1Begin()
{
    if (m_pEffect)
    {
        m_pd3dDevice->GetTransform(D3DTS_VIEW & m_matViewNew);
        m_pd3dDevice->GetTransform(D3DTS_PROJECTION & m_matProj);
        m_pEffect->Begin(NULL, 0);
    }
}

void MOTION_BLUR::Step1BeginPass()
{
    if (m_pEffect)
    {
        m_pEffect->BeginPass(0);
    }
}

// 로컬 좌표계
void MOTION_BLUR::Step1SetMatrix(D3DXMATRIX* pMatWorldNew, D3DXMATRIX* pMatWorldOld)
{
    if (m_pEffect)
    {
        D3DXMATRIX m;
        D3DXVECTOR4 LightDir;
        D3DXVECTOR4 v;

        // 현재의 월드 행렬로 변환
        m = (*pMatWorldNew) * m_matViewNew * m_matProj;
        m_pEffect->SetMatrix(m_pWVPNew & m);

        // 과거의 월드 행렬로 변환
        m = (*pMatWorldOld) * m_matViewOld * m_matProj;
        m_pEffect->SetMatrix(m_pWVPOld & m);

        m = (*pMatWorldNew) * m_matViewNew * m_matProj;
        m._11 = 1.0f; m._22 = 1.0f; m._33 = 1.0f;
        m._41 = 0.0f; m._42 = 0.0f; m._43 = 0.0f;
        m_pEffect->SetMatrix(m_pROnly & m);
    }

    else
        m_pd3dDevice->SetTransform(D3DTS_WORLD, pMatWorldNew);
}

void MOTION_BLUR::CommitChanges()
{
    if (m_pEffect)
        m_pEffect->CommitChanges();
}

void MOTION_BLUR::Step1EndPass()
{
    if (m_pEffect)
    {
        m_pEffect->EndPass();
    }
}

void MOTION_BLUR::Step1End()
{
    if (m_pEffect)
    {
        m_pEffect->End();
    }
}

void MOTION_BLUR::Step2Render()
{
    if (m_pEffect)
    {
        m_pEffect->Begin(NULL, 0);
        m_pEffect->BeginPass(1);

        D3D2DSQUARE::Render();

        m_pEffect->EndPass();
        m_pEffect->End();

        CopyMemory(&m_matViewOld & m_matViewNew, sizeof(D3DXMATRIX));
    }
}

BOOL MOTION_BLUR::IsOK()
{
    if (m_pEffect)
        return TRUE;

    return FALSE;
}