import { getRepository } from 'typeorm';
import { Sprint } from '../../entities/sprint';
import { SprintType } from '../../types/type.sprint';

const createSprint = async (sprintDTO: SprintType) => {
  const sprintRepo = getRepository(Sprint);
  const newSprint = new Sprint();
  newSprint.name = sprintDTO.name;
  newSprint.startAt = sprintDTO.startAt;
  newSprint.endAt = sprintDTO.endAt;
  newSprint.status = sprintDTO.status;
  newSprint.index = sprintDTO.index;
  newSprint.folderId = sprintDTO.folderId;
  // save
  return await sprintRepo.save(newSprint);
};

const getSprintByFolderId = async (folderId: number) => {
  const sprintRepo = getRepository(Sprint);
  const sprintList = await sprintRepo.find({
    where: {
      folderId: folderId,
    },
  });
  return sprintList;
};

export default { createSprint, getSprintByFolderId };
