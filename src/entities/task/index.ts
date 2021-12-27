import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Process } from '../process';
import { Sprint } from '../sprint';
import { UserTask } from '../user-task';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  dueDate: Date;

  @Column()
  description: string;

  @Column()
  processId: number;

  @Column()
  result: string;

  @Column()
  estimateTime: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  sprintId: number;

  @ManyToOne(() => Process, (process) => process.tasks)
  @JoinColumn({ name: 'processId', referencedColumnName: 'id' })
  process: Process;

  @ManyToOne(() => Sprint, (sprint) => sprint.tasks)
  @JoinColumn({ name: 'sprintId', referencedColumnName: 'id' })
  sprint: Sprint;

  @OneToMany(() => UserTask, (userTask) => userTask.task)
  userTasks: UserTask[];
}
