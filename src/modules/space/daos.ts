import { getRepository } from 'typeorm';
import { Space } from '../../entities/space';
import { SpaceType } from '../../types/type.space';

const getSpacesByWorkspaceId = async (workspaceId: number) => {
  const spaceRepo = getRepository(Space);
  const spaceList = await spaceRepo
    .createQueryBuilder('s')
    .leftJoinAndSelect('s.folders', 'folder')
    .leftJoinAndSelect('folder.sprints', 'sprint')
    .where(`s.workspaceId = ${workspaceId}`)
    .getMany();
  return spaceList;
};

const createSpace = async (spaceDTO: SpaceType) => {
  const spaceRepo = getRepository(Space);
  const space = new Space();
  space.name = spaceDTO.name;
  space.color = spaceDTO.color;
  space.workspaceId = Number(spaceDTO.workspaceId);
  // save
  return await spaceRepo.save(space);
};

export default { createSpace, getSpacesByWorkspaceId };
