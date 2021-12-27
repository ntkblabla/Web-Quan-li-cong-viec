import spaceDaos from './daos';
import { SpaceType } from '../../types/type.space';

const getSpacesByWorkspaceId = async (workspaceId: number) => {
  return await spaceDaos.getSpacesByWorkspaceId(workspaceId);
};

const createSpace = async (spaceDTO: SpaceType) => {
  return await spaceDaos.createSpace(spaceDTO);
};

export default { createSpace, getSpacesByWorkspaceId };
