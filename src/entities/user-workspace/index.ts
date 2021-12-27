import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user';
import { Workspace } from '../workspace';

@Entity()
export class UserWorkspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  workspaceId: number;

  @ManyToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.id, { cascade: true })
  @JoinColumn({ name: 'workspaceId', referencedColumnName: 'id' })
  workspace: Workspace;
}
