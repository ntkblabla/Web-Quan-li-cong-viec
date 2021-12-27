export type TaskType = {
  id?: number;
  title: string;
  dueDate: Date;
  description: string;
  processId: number;
  result: string;
  estimateTime: number;
  createdAt?: Date;
  updatedAt?: Date;
  sprintId: number;
  userId?: number;
};
