import codes from '../../errors/codes';
import CustomError from '../../errors/customError';
import workspaceServices from './services';
import { WorkspaceType } from '../../types/type.workspace';

const create = async (req: any, res: any) => {
  const { name, color } = req.body;
  const userId = req.user.id;
  const workspaceDTO: WorkspaceType = {
    name,
    color,
  };
  const newWorkspace = await workspaceServices.createWorkspace(workspaceDTO, userId);
  res.status(200).json({
    status: 'success',
    result: newWorkspace,
  });
};

const getByUserId = async (req: any, res: any) => {
  const userId = req.params.userId;
  if (Number(userId) !== Number(req.user.id)) {
    throw new CustomError(codes.UNAUTHORIZED);
  }
  const workspaceList = await workspaceServices.getWorkspaceByUserId(userId);
  res.status(200).json({
    status: 'success',
    result: workspaceList,
  });
};

const update = async (req: any, res: any) => {
  const updateData: WorkspaceType = req.body;
  const id = req.params.workspaceId;
  const userId = req.params.userId;
  if (Number(userId) !== Number(req.user.id)) {
    throw new CustomError(codes.UNAUTHORIZED);
  }
  const updateWorkspace = await workspaceServices.updateWorkspace(id, userId, updateData);
  res.status(200).json({
    status: 'success',
    result: updateWorkspace,
  });
};

const getMemberWorkspace = async (req: any, res: any) => {
  const id: number = req.params.workspaceId;
  const members = await workspaceServices.getMemberWorkspace(id);
  res.status(200).json({
    status: 'success',
    result: members,
  });
};

const addMemberToWorkspace = async (req: any, res: any) => {
  const workspaceId = req.params.workspaceId;
  const { email } = req.body;
  const data = await workspaceServices.addMemberToWorkspace(workspaceId, email);
  res.status(200).json({
    status: 'success',
    result: data,
  });
};

export default { create, getByUserId, update, getMemberWorkspace, addMemberToWorkspace };
