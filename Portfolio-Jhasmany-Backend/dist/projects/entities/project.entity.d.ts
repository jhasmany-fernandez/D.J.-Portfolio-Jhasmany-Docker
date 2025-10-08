import { User } from '../../users/entities/user.entity';
export declare class Project {
    id: string;
    title: string;
    description: string;
    content: string;
    technologies: string[];
    imageUrl: string;
    demoUrl: string;
    githubUrl: string;
    isPublished: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    author: User;
    authorId: string;
}
