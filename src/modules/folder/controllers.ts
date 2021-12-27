import folderServices from './services';
import { FolderType } from '../../types/type.folder';

const create = async (req: any, res: any) => {
  const { name } = req.body;
  const spaceId = req.params.spaceId;
  const folderDTO: FolderType = {
    name,
    spaceId: Number(spaceId),
  };
  const newFolder = await folderServices.createFolder(folderDTO);
  res.status(200).json({
    status: 'success',
    result: newFolder,
  });
};

const getFolderById = async (req: any, res: any) => {
  const folderId = req.params.folderId;
  const spaceId = req.params.spaceId;
  const folder = await folderServices.getFolderById(spaceId, folderId);
  res.status(200).json({
    status: 'success',
    result: folder,
  });
};

const update = async (req: any, res: any) => {
  const { name } = req.body;
  const spaceId = req.params.spaceId;
  const folderId = req.params.folderId;
  const folderDTO: FolderType = {
    name,
  };
  const updateFolder = await folderServices.updateFolder(spaceId, folderId, folderDTO);
  res.status(200).json({
    status: 'success',
    result: updateFolder,
  });
};

export default { create, getFolderById, update };
