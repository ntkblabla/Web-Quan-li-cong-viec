import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Space } from '../space';
import { Sprint } from '../sprint';

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  spaceId: number;

  @ManyToOne(() => Space, (space) => space.folders)
  @JoinColumn({ name: 'spaceId', referencedColumnName: 'id' })
  space: Space;

  @OneToMany(() => Sprint, (sprint) => sprint.folder)
  sprints: Sprint[];
}
