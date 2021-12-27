import { TaskType } from '../../types/type.task';
import taskServices from './services';

const create = async (req: any, res: any) => {
  const { title, dueDate, description, processId, result, estimateTime, userId } = req.body;
  const sprintId = req.params.sprintId;
  const data: TaskType = {
    title,
    dueDate,
    description,
    processId: Number(processId),
    result,
    estimateTime: Number(estimateTime),
    sprintId: Number(sprintId),
    userId: userId ? Number(userId) : null,
  };
  const newTask = await taskServices.createTask(data);
  res.status(200).json({
    status: 'success',
    result: newTask,
  });
};

const getTasksBySprintId = async (req: any, res: any) => {
  const sprintId = req.params.sprintId as number;
  const spaceId = req.params.spaceId as number;
  const data = await taskServices.getTasksBySprintId(sprintId, spaceId);
  res.status(200).json({
    status: 'success',
    result: data,
  });
};

const update = async (req: any, res: any) => {
  const taskId = req.params.taskId;
  const data: TaskType = {
    ...req.body,
  };
  const newTask = await taskServices.updateTask(taskId, data);
  res.status(200).json({
    status: 'success',
    result: newTask,
  });
};

const updateUserTask = async (req: any, res: any) => {
  const taskId = req.params.taskId;
  const userId = req.params.userId;
  const data = await taskServices.updateUserTask(taskId, userId);
  res.status(200).json({
    status: 'success',
    result: data,
  });
};

const clearUserTask = async (req: any, res: any) => {
  const taskId = req.params.taskId;
  const data = await taskServices.clearUserTask(taskId);
  res.status(200).json({
    status: 'success',
    result: data,
  });
};

const getTasksById = async (req: any, res: any) => {
  const id = req.params.taskId as number;
  const data = await taskServices.getTaskById(id);
  res.status(200).json({
    status: 'success',
    result: data,
  });
};

export default { create, getTasksBySprintId, update, updateUserTask, clearUserTask, getTasksById };
