import { getRepository } from 'typeorm';
import { Folder } from '../../entities/folder';
import codes from '../../errors/codes';
import CustomError from '../../errors/customError';
import { FolderType } from '../../types/type.folder';

const createFolder = async (folderDTO: FolderType) => {
  const folderRepo = getRepository(Folder);
  const newFolder = new Folder();
  newFolder.name = folderDTO.name;
  newFolder.spaceId = folderDTO.spaceId;
  const folder = await folderRepo.save(newFolder);
  return folder;
};

const getFolderById = async (spaceId: number, id: number) => {
  const folderRepo = getRepository(Folder);
  const folderList = await folderRepo.find({
    where: {
      id: id,
      spaceId: spaceId,
    },
  });
  return folderList;
};

const updateFolder = async (spaceId: number, id: number, folderDTO: FolderType) => {
  const folderRepo = getRepository(Folder);
  const updateFolderRecord = await folderRepo.findOne({
    where: {
      id: id,
      spaceId: spaceId,
    },
  });
  if (!updateFolderRecord) {
    throw new CustomError(codes.NOT_FOUND, 'User not found!');
  } else {
    for (const key in folderDTO) {
      if (Object.prototype.hasOwnProperty.call(folderDTO, key)) {
        const value = folderDTO[key];
        updateFolderRecord[key] = value;
      }
    }
  }
  // save
  const folder = await folderRepo.save(updateFolderRecord);
  return folder;
};

export default { createFolder, getFolderById, updateFolder };
