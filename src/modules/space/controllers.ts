import spaceServices from './services';
import { SpaceType } from '../../types/type.space';

const getSpacesByWorkspaceId = async (req: any, res: any) => {
  const workspaceId: number = req.params.workspaceId;
  const spaceList = await spaceServices.getSpacesByWorkspaceId(workspaceId);
  res.status(200).json({
    status: 'success',
    result: spaceList,
  });
};

const create = async (req: any, res: any) => {
  const { name, color } = req.body;
  const workspaceId = req.params.workspaceId;
  const spaceDTO: SpaceType = {
    name,
    color,
    workspaceId,
  };
  const newSpace = await spaceServices.createSpace(spaceDTO);
  res.status(200).json({
    status: 'success',
    result: newSpace,
  });
};

export default { create, getSpacesByWorkspaceId };
