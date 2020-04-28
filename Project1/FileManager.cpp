#include "stdafx.h"
#include "FileManager.h"

FileManager::FileManager()
{
}

FileManager::~FileManager()
{
}

void FileManager::GetFileListFromFolder(bstr_t folderPath, vector<bstr_t>& vecStr)
{
	// 폴더를 불러오면 그 폴더 안의 파일 명을 이름순으로 벡터에 담는다.
	WIN32_FIND_DATA fd;
	HANDLE hFind = FindFirstFile(folderPath, &fd);

	if (INVALID_HANDLE_VALUE == hFind)
		return;

	FindNextFile(hFind, &fd);

	while (TRUE == FindNextFile(hFind, &fd))
	{
		vecStr.push_back(bstr_t(fd.cFileName));
	}

	FindClose(hFind);
}
