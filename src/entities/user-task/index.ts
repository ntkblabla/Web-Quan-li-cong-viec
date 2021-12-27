import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../task';
import { User } from '../user';

@Entity()
export class UserTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  taskId: number;

  @ManyToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Task, (task) => task.id, { cascade: true })
  @JoinColumn({ name: 'taskId', referencedColumnName: 'id' })
  task: Task;
}
