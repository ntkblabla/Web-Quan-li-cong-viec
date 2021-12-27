import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Space } from '../space';
import { UserWorkspace } from '../user-workspace';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  color: string;

  @OneToMany(() => Space, (space) => space.workspace)
  spaces: Space[];

  @OneToMany(() => UserWorkspace, (userworkspace) => userworkspace.workspace)
  userWorkspaces: UserWorkspace[];
}
