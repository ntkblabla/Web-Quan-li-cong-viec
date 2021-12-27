import sprintDaos from './daos';
import { SprintType } from '../../types/type.sprint';

const createSprint = async (sprintDTO: SprintType) => {
  return await sprintDaos.createSprint(sprintDTO);
};

const getSprintByFolderId = async (folderId: number) => {
  return await sprintDaos.getSprintByFolderId(folderId);
};

export default { createSprint, getSprintByFolderId };
