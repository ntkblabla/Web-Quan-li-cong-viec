import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Space } from '../space';
import { Task } from '../task';

@Entity()
export class Process {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column()
  isCompleted: boolean;

  @Column()
  order: number;

  @Column({ nullable: true })
  spaceId: number;

  @ManyToOne(() => Space, (space) => space.processes)
  @JoinColumn({ name: 'spaceId', referencedColumnName: 'id' })
  space: Space;

  @OneToMany(() => Task, (task) => task.process)
  tasks: Task[];
}
