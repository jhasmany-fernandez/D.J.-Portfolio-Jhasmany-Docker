import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, authorId: string): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      authorId,
    });
    return this.projectsRepository.save(project);
  }

  async findAll(published?: boolean): Promise<Project[]> {
    const query = this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.author', 'author')
      .orderBy('project.order', 'ASC')
      .addOrderBy('project.createdAt', 'DESC');

    if (published !== undefined) {
      query.where('project.isPublished = :published', { published });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async findByAuthor(authorId: string): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { authorId },
      relations: ['author'],
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    await this.projectsRepository.update(id, updateProjectDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.projectsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async updateOrder(id: string, order: number): Promise<Project> {
    await this.projectsRepository.update(id, { order });
    return this.findOne(id);
  }

  async togglePublished(id: string): Promise<Project> {
    const project = await this.findOne(id);
    await this.projectsRepository.update(id, { isPublished: !project.isPublished });
    return this.findOne(id);
  }
}