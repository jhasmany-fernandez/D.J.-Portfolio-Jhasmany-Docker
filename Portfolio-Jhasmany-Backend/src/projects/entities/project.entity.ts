import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  content: string;

  @Column('simple-array', { nullable: true })
  technologies: string[];

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  demoUrl: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column('uuid')
  authorId: string;
}