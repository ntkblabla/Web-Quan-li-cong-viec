import { getRepository } from 'typeorm';
import { UserWorkspace } from '../../entities/user-workspace';
import { Workspace } from '../../entities/workspace';
import codes from '../../errors/codes';
import CustomError from '../../errors/customError';
import { WorkspaceType } from '../../types/type.workspace';

const createWorkspace = async (workspaceDTO: WorkspaceType, userId: number) => {
  const workspaceRepository = getRepository(Workspace);
  const userWorkspaceRepository = getRepository(UserWorkspace);
  // create workspace
  const workspace = new Workspace();
  workspace.name = workspaceDTO.name;
  workspace.color = workspaceDTO.color;
  // save workspace
  const newWorkspace = await workspaceRepository.save(workspace);
  // create user_workspace
  const userWorkspace = new UserWorkspace();
  userWorkspace.userId = userId;
  userWorkspace.workspaceId = newWorkspace.id;
  // save user_workspace
  await userWorkspaceRepository.save(userWorkspace);
  return newWorkspace;
};

const getWorkspaceByUserId = async (userId: number) => {
  const workspaceRepo = getRepository(Workspace);
  const workspacesGetByUserId = await workspaceRepo
    .createQueryBuilder('ws')
    .innerJoin(UserWorkspace, 'user_workspace', 'ws.id = user_workspace.workspaceId')
    .where(`user_workspace.userId = ${userId}`)
    .getMany();
  return workspacesGetByUserId;
};

const getWorkspaceById = async (id: number, userId: number) => {
  const workspaceRepo = getRepository(Workspace);
  const workspace = await workspaceRepo
    .createQueryBuilder('ws')
    .innerJoin(UserWorkspace, 'uw', 'ws.id = uw.workspaceId')
    .where(`uw.userId = ${userId} and ws.id = ${id}`)
    .getOne();
  return workspace;
};

const updateWorkspace = async (id: number, userId: number, updateData: WorkspaceType) => {
  const workspace = await getWorkspaceById(id, userId);
  if (!workspace) {
    throw new CustomError(codes.NOT_FOUND, 'Workspace not found!');
  } else {
    for (const key in updateData) {
      if (Object.prototype.hasOwnProperty.call(updateData, key)) {
        const value = updateData[key];
        workspace[key] = value;
      }
    }
  }
  const updateWorkspaceRes = await getRepository(Workspace).save(workspace);
  return updateWorkspaceRes;
};

export default { createWorkspace, getWorkspaceByUserId, getWorkspaceById, updateWorkspace };
