#pragma once

class MOTION_BLUR
{
private:
    LPD3DXEFFECT m_pEffect;
    D3DXHANDLE m_pTechnique, m_pWVPNew, m_pWVPOld, m_pROnly;
    XMFLOAT4X4	 m_matViewNew, m_matViewOld, m_matProj;
    //LPDIRECT3DDEVICE9 m_pd3dDevice;
    //D3DPRESENT_PARAMETERS* m_pd3dParameters;


public:
    MOTION_BLUR(LPDIRECT3DDEVICE9 pd3dDevice, D3DPRESENT_PARAMETERS* pd3dParameters);
    ~MOTION_BLUR();
    HRESULT Load();
    void Invalidate();
    void Restore();

    // 속도 맵을 작성
    void Step1Begin();
    void Step1BeginPass();
    void Step1SetMatrix(D3DXMATRIX* pMatWorldNew, D3DXMATRIX* pMatWorldOld);
    void Step1EndPass();
    void Step1End();

    // 생성 속도 맵을 참조 샘플링
    void Step2Render();

    void CommitChanges();
    BOOL IsOK();
    LPD3DXEFFECT GetEffect() { return m_pEffect; };
};