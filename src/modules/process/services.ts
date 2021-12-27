import { ProcessType } from '../../types/type.process';
import processDaos from './daos';

const createProcess = async (processDTO: ProcessType) => {
  return await processDaos.createProcess(processDTO);
};

const updateProcess = async (processId: number, processDTO: ProcessType) => {
  return await processDaos.updateProcess(processId, processDTO);
};

const getListProcessBySpaceId = async (spaceId: number) => {
  return await processDaos.getListProcessBySpaceId(spaceId);
};

export default { createProcess, updateProcess, getListProcessBySpaceId };
