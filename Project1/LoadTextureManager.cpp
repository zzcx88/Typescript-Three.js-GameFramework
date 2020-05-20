#include "stdafx.h"
#include "LoadTextureManager.h"

LoadTextureManager::LoadTextureManager()
{
}

LoadTextureManager::~LoadTextureManager()
{
}

UINT LoadTextureManager::LoadTextureFromFolder(ID3D12Device* pd3dDevice, ID3D12GraphicsCommandList* pd3dCommandList, bstr_t folderPath, CTexture* pTexture[])
{
	vector<bstr_t> fileNames;
	GET_MANAGER<FileManager>()->GetFileListFromFolder(folderPath + "/*.*", fileNames);

	TCHAR originPath[1024];
	memset(originPath, 0, sizeof(TCHAR) * 1024);
	lstrcpy(originPath, (TCHAR*)(folderPath + "/"));

	UINT i = 0;
	for (auto& file : fileNames)
	{
		TCHAR* tmpPath = new TCHAR[1024];
		memset(tmpPath, 0, sizeof(TCHAR) * 1024);
		lstrcpy(tmpPath, originPath);
		lstrcat(tmpPath, (TCHAR*)file);
		//cout << (bstr_t)tmpPath << endl;
		pTexture[(UINT)i] = new CTexture(1, RESOURCE_TEXTURE2D, 0);
		pTexture[(UINT)i]->LoadTextureFromFile(pd3dDevice, pd3dCommandList, (bstr_t)tmpPath, 0);
		++i;
	}
	return i - 1;
}
