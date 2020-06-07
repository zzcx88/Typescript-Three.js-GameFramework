#pragma once
#include "CGameObject.h"

class CGunshipObject : public CGameObject
{
public:
	CGunshipObject(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, ID3D12RootSignature* pd3dGraphicsRootSignature);
	virtual ~CGunshipObject();

private:
	/*CGameObject* m_pMainRotorFrame = NULL;
	CGameObject* m_pTailRotorFrame = NULL;*/

public:
	virtual void OnPrepareAnimate();
	virtual void Animate(float fTimeElapsed);
};

