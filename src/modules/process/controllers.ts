import processServices from './services';
import { ProcessType } from '../../types/type.process';

const create = async (req: any, res: any) => {
  const { name, color, order, isCompleted } = req.body;
  const processDTO: ProcessType = {
    name,
    color,
    order,
    isCompleted,
  };
  const newWorkspace = await processServices.createProcess(processDTO);
  res.status(200).json({
    status: 'success',
    result: newWorkspace,
  });
};

const update = async (req: any, res: any) => {
  const process = req.body;
  const id = req.params.id;

  const updatedProcess = await processServices.updateProcess(id, process as ProcessType);
  res.status(200).json({
    status: 'success',
    result: updatedProcess,
  });
};

const getListBySpaceId = async (req: any, res: any) => {
  const spaceId = req.params.spaceId;

  const processes = await processServices.getListProcessBySpaceId(spaceId);
  res.status(200).json({
    status: 'success',
    result: processes,
  });
};

export default { create, update, getListBySpaceId };
