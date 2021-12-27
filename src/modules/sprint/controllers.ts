import sprintServices from './services';
import { SprintType } from '../../types/type.sprint';

const create = async (req: any, res: any) => {
  const { name, startAt, endAt, status, index } = req.body;
  const folderId = req.params.folderId;
  const data: SprintType = {
    name,
    startAt,
    endAt,
    status,
    index,
    folderId,
  };
  const newSprint = await sprintServices.createSprint(data);
  res.status(200).json({
    status: 'success',
    result: newSprint,
  });
};

const getFolderByFolderId = async (req: any, res: any) => {
  const folderId = req.params.folderId;
  const sprintList = await sprintServices.getSprintByFolderId(folderId);
  res.status(200).json({
    status: 'success',
    result: sprintList,
  });
};

export default { create, getFolderByFolderId };
