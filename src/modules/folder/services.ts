import { FolderType } from '../../types/type.folder';
import folderDaos from './daos';

const createFolder = async (folderDTO: FolderType) => {
  const folder = await folderDaos.createFolder(folderDTO);
  return folder;
};

const getFolderById = async (spaceId: number, id: number) => {
  const folderList = await folderDaos.getFolderById(spaceId, id);
  return folderList;
};

const updateFolder = async (spaceId: number, id: number, folderDTO: FolderType) => {
  const folder = await folderDaos.updateFolder(spaceId, id, folderDTO);
  return folder;
};

export default { createFolder, getFolderById, updateFolder };
