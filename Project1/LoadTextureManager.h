#pragma once
class CTexture;
class LoadTextureManager : public SingletonBase<FileManager>
{
public:
	LoadTextureManager();
	virtual ~LoadTextureManager();

public:
	UINT LoadTextureFromFolder(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, bstr_t folderPath, CTexture* pTexture[]);
};

