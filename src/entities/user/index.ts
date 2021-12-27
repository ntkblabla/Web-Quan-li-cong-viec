import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserTask } from '../user-task';
import { UserWorkspace } from '../user-workspace';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar?: string | null;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserWorkspace, (userWorkspace) => userWorkspace.user)
  userWorkspaces: UserWorkspace[];

  @OneToMany(() => UserTask, (userTask) => userTask.user)
  userTasks: UserTask[];
}
