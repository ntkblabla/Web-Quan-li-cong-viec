import { getRepository } from 'typeorm';
import { Process } from '../../entities/process';
import { Sprint } from '../../entities/sprint';
import { Task } from '../../entities/task';
import { UserTask } from '../../entities/user-task';
import codes from '../../errors/codes';
import CustomError from '../../errors/customError';
import { ProcessType } from '../../types/type.process';
import { TaskType } from '../../types/type.task';

const createTask = async (taskDTO: TaskType) => {
  const taskRepo = getRepository(Task);
  const newTask = new Task();
  newTask.title = taskDTO.title;
  newTask.dueDate = taskDTO.dueDate || null;
  newTask.description = taskDTO.description;
  newTask.result = taskDTO.result;
  newTask.processId = taskDTO.processId;
  newTask.sprintId = taskDTO.sprintId;
  newTask.createdAt = new Date();
  newTask.updatedAt = new Date();
  newTask.estimateTime = taskDTO.estimateTime;
  const taskRes = await taskRepo.save(newTask);
  if (taskDTO.userId) {
    const userTaskRepo = getRepository(UserTask);
    const newUserTask = new UserTask();
    newUserTask.userId = taskDTO.userId;
    newUserTask.taskId = taskRes.id;
    await userTaskRepo.save(newUserTask);
  }
  const dataRes = await taskRepo
    .createQueryBuilder('t')
    .leftJoinAndSelect('t.process', 'p')
    .leftJoinAndSelect('t.sprint', 's')
    .where(`t.id = ${taskRes.id}`)
    .getOne();
  return dataRes;
};

const getTasksBySprintId = async (sprintId: number, spaceId: number) => {
  const sprintRepo = getRepository(Sprint);
  const processRepo = getRepository(Process);
  const processes = await processRepo.find({
    where: {
      spaceId: spaceId,
    },
  });
  const taskBySprint = await sprintRepo
    .createQueryBuilder('s')
    .leftJoinAndSelect('s.tasks', 't')
    .leftJoinAndSelect('t.sprint', 'sprint')
    .leftJoinAndSelect('t.userTasks', 'ut')
    .leftJoinAndSelect('ut.user', 'u')
    .where(`s.id = ${sprintId}`)
    .getOne();
  const activeProcesses = processes
    .filter((process: ProcessType) => !process.isCompleted)
    .sort((a: ProcessType, b: ProcessType) => a.order - b.order);
  const completeProcesses = processes.filter((process: ProcessType) => process.isCompleted);
  const sortProcess = [...activeProcesses, ...completeProcesses];
  const taskByProcess = sortProcess.map((process: ProcessType) => {
    return {
      ...process,
      tasks: getTaskByProcess(process.id, taskBySprint.tasks),
    };
  });
  return taskByProcess;
};

const getTaskByProcess = (processId: number, tasks: TaskType[]) => {
  const tasksByProcess: TaskType[] = [];
  tasks.forEach((task: TaskType) => {
    if (+task.processId === +processId) {
      tasksByProcess.push(task);
    }
  });
  return tasksByProcess;
};

const updateTask = async (taskId: number, taskDTO: TaskType) => {
  const taskRepo = getRepository(Task);
  const updateRecord = await taskRepo.findOne(taskId);
  if (!updateRecord) {
    throw new CustomError(codes.NOT_FOUND, 'Task not found!');
  } else {
    for (const key in taskDTO) {
      if (Object.prototype.hasOwnProperty.call(taskDTO, key)) {
        const element = taskDTO[key];
        updateRecord[key] = element;
      }
    }
  }
  // save
  const res = await taskRepo.save(updateRecord);
  const dataRes = await taskRepo
    .createQueryBuilder('t')
    .leftJoinAndSelect('t.process', 'p')
    .leftJoinAndSelect('t.sprint', 's')
    .leftJoinAndSelect('t.userTasks', 'ut')
    .leftJoinAndSelect('ut.user', 'u')
    .where(`t.id = ${res.id}`)
    .getOne();
  return dataRes;
};

const updateUserTask = async (taskId: number, userId: number) => {
  const userTaskRepo = getRepository(UserTask);
  const taskRepo = getRepository(Task);
  const userTask = await userTaskRepo.findOne({
    where: {
      userId: userId,
      taskId: taskId,
    },
  });
  if (userTask) {
    return {};
  }
  const newUT = new UserTask();
  newUT.userId = Number(userId);
  newUT.taskId = Number(taskId);
  await userTaskRepo.save(newUT);
  const resData = await taskRepo
    .createQueryBuilder('t')
    .leftJoinAndSelect('t.process', 'p')
    .leftJoinAndSelect('t.sprint', 's')
    .leftJoinAndSelect('t.userTasks', 'ut')
    .leftJoinAndSelect('ut.user', 'u')
    .where(`t.id = ${taskId}`)
    .getOne();
  return resData;
};

const clearUserTask = async (taskId: number) => {
  const userTaskRepo = getRepository(UserTask);
  const taskRepo = getRepository(Task);
  await userTaskRepo.delete({
    taskId: taskId,
  });
  const resData = await taskRepo
    .createQueryBuilder('t')
    .leftJoinAndSelect('t.process', 'p')
    .leftJoinAndSelect('t.sprint', 's')
    .leftJoinAndSelect('t.userTasks', 'ut')
    .leftJoinAndSelect('ut.user', 'u')
    .where(`t.id = ${taskId}`)
    .getOne();
  return resData;
};

const getTaskById = async (id: number) => {
  const taskRepo = getRepository(Task);
  const resData = await taskRepo
    .createQueryBuilder('t')
    .leftJoinAndSelect('t.process', 'p')
    .leftJoinAndSelect('t.sprint', 's')
    .leftJoinAndSelect('t.userTasks', 'ut')
    .leftJoinAndSelect('ut.user', 'u')
    .where(`t.id = ${id}`)
    .getOne();
  return resData;
};

export default { createTask, getTasksBySprintId, updateTask, updateUserTask, clearUserTask, getTaskById };
