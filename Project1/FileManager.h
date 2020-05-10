#pragma once
#include "SingletonBase.h"
class FileManager : public SingletonBase<FileManager>
{
public:
	FileManager();
	virtual ~FileManager();

public:
	void GetFileListFromFolder(bstr_t folderPath, vector<bstr_t>& vecStr);
};
