import { Project } from '../../projects/entities/project.entity';
export declare class User {
    id: string;
    email: string;
    name: string;
    password: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    projects: Project[];
}
