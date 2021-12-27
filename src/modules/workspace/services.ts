import { getRepository } from 'typeorm';
import { User } from '../../entities/user';
import { UserWorkspace } from '../../entities/user-workspace';
import { Workspace } from '../../entities/workspace';
import codes from '../../errors/codes';
import CustomError from '../../errors/customError';
import { WorkspaceType } from '../../types/type.workspace';
import workspaceDaos from './daos';

const createWorkspace = async (workspace: WorkspaceType, userId: number) => {
  return await workspaceDaos.createWorkspace(workspace, userId);
};

const getWorkspaceByUserId = async (userId: number) => {
  return await workspaceDaos.getWorkspaceByUserId(userId);
};

const getWorkspaceById = async (id: number, userId: number) => {
  return await workspaceDaos.getWorkspaceById(id, userId);
};

const updateWorkspace = async (id: number, userId: number, updateData: WorkspaceType) => {
  return await workspaceDaos.updateWorkspace(id, userId, updateData);
};

const getMemberWorkspace = async (id: number) => {
  const workspaceRepo = getRepository(Workspace);
  const data = await workspaceRepo
    .createQueryBuilder('w')
    .leftJoinAndSelect('w.userWorkspaces', 'uw')
    .leftJoinAndSelect('uw.user', 'user')
    .where(`w.id = ${id}`)
    .getOne();
  const members = data.userWorkspaces.map((userWorkspace: { user: User }) => {
    delete userWorkspace.user.password;
    return userWorkspace.user;
  });
  return members;
};

const addMemberToWorkspace = async (wId: number, email: string) => {
  const userWorkspaceRepo = getRepository(UserWorkspace);
  const newUserWs = new UserWorkspace();
  const user = await findUser({ email });
  if (!user) {
    throw new CustomError(codes.NOT_FOUND, 'User not found');
  }
  const userWorkspaceCheck = await userWorkspaceRepo.findOne({
    where: {
      workspaceId: wId,
      userId: user.id,
    },
  });
  if (userWorkspaceCheck) {
    throw new CustomError(codes.DUPLICATE, 'User is already in the workspace');
  }
  newUserWs.workspaceId = wId;
  newUserWs.userId = user.id;
  return await userWorkspaceRepo.save(newUserWs);
};

const findUser = async (dataFind: { email?: string; id?: number }) => {
  const userReposity = getRepository(User);
  let user: any;
  if (dataFind.email) {
    user = await userReposity.findOne({
      where: {
        email: dataFind.email,
      },
    });
  } else if (dataFind.id) {
    user = await userReposity.findOne({
      where: {
        id: dataFind.id,
      },
    });
  }
  return user;
};

export default {
  createWorkspace,
  getWorkspaceByUserId,
  getWorkspaceById,
  updateWorkspace,
  getMemberWorkspace,
  addMemberToWorkspace,
};
