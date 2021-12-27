import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Folder } from '../folder';
import { Process } from '../process';
import { Workspace } from '../workspace';

@Entity()
export class Space {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column()
  workspaceId: number;

  @ManyToOne(() => Workspace, (workspace) => workspace.spaces)
  @JoinColumn({ name: 'workspaceId', referencedColumnName: 'id' })
  workspace: Workspace;

  @OneToMany(() => Process, (process) => process.id)
  processes: Process[];

  @OneToMany(() => Folder, (folder) => folder.space)
  folders: Folder[];
}
