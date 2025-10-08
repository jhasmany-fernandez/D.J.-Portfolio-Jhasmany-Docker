import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private projectsRepository;
    constructor(projectsRepository: Repository<Project>);
    create(createProjectDto: CreateProjectDto, authorId: string): Promise<Project>;
    findAll(published?: boolean): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    findByAuthor(authorId: string): Promise<Project[]>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project>;
    remove(id: string): Promise<void>;
    updateOrder(id: string, order: number): Promise<Project>;
    togglePublished(id: string): Promise<Project>;
}
