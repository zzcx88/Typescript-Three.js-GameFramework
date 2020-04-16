#pragma once
#include "SingletonBase.h"

class MinimapManager : public SingletonBase<MinimapManager>
{
public:
	MinimapManager();
	virtual ~MinimapManager();

public:
	void MoveMinimapPoint(ObjectManager::MAPOBJ* PlyList, ObjectManager::MAPOBJ* PPntList, ObjectManager::MAPOBJ* EneList, ObjectManager::MAPOBJ* EPntList);
};
