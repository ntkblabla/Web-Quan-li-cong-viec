import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Folder } from '../folder';
import { Task } from '../task';

@Entity()
export class Sprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  startAt: Date;

  @Column()
  endAt: Date;

  @Column()
  status: string;

  @Column()
  index: number;

  @Column()
  folderId: number;

  @ManyToOne(() => Folder, (folder) => folder.sprints)
  @JoinColumn({ name: 'folderId', referencedColumnName: 'id' })
  folder: Folder;

  @OneToMany(() => Task, (task) => task.sprint)
  tasks: Task[];
}
