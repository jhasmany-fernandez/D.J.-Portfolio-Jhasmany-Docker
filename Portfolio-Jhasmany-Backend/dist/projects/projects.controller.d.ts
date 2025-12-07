import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto, req: any): Promise<import("./entities/project.entity").Project>;
    findAll(published?: string): Promise<import("./entities/project.entity").Project[]>;
    findMy(req: any): Promise<import("./entities/project.entity").Project[]>;
    findOne(id: string): Promise<import("./entities/project.entity").Project>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<import("./entities/project.entity").Project>;
    updateOrder(id: string, order: number): Promise<import("./entities/project.entity").Project>;
    togglePublished(id: string): Promise<import("./entities/project.entity").Project>;
    remove(id: string): Promise<void>;
}
