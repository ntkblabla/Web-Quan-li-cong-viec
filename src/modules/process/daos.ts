import { getRepository } from 'typeorm';
import { Process } from '../../entities/process';
import codes from '../../errors/codes';
import CustomError from '../../errors/customError';
import { ProcessType } from '../../types/type.process';

const createProcess = async (processDTO: ProcessType) => {
  const processRepo = getRepository(Process);
  const newProcess = new Process();
  newProcess.name = processDTO.name;
  newProcess.color = processDTO.color;
  newProcess.isCompleted = processDTO.isCompleted;
  newProcess.order = processDTO.order;
  // save
  const resProcess = await processRepo.save(newProcess);
  return resProcess;
};

const updateProcess = async (processId: number, processDTO: ProcessType) => {
  const processRepo = getRepository(Process);
  const updateProcessRecord = await processRepo.findOne(processId);
  if (!updateProcessRecord) {
    throw new CustomError(codes.NOT_FOUND, 'Process not found!');
  } else {
    for (const key in processDTO) {
      if (Object.prototype.hasOwnProperty.call(processDTO, key)) {
        const element = processDTO[key];
        updateProcessRecord[key] = element;
      }
    }
    console.log('data: ', updateProcessRecord, processDTO);
  }
  // save
  const resProcess = await processRepo.save(updateProcessRecord);
  return resProcess;
};

const getListProcessBySpaceId = async (spaceId: number) => {
  const processRepo = getRepository(Process);
  const processList = await processRepo.find({
    where: {
      spaceId: spaceId,
    },
  });
  const activeProcess = processList
    .filter((process: ProcessType) => {
      return !process.isCompleted;
    })
    .sort((a: ProcessType, b: ProcessType) => a.order - b.order);
  const completeProcess = processList.filter((process: ProcessType) => {
    return process.isCompleted;
  });
  return {
    activeProcesses: activeProcess,
    completeProcesses: completeProcess,
  };
};

export default { createProcess, updateProcess, getListProcessBySpaceId };
