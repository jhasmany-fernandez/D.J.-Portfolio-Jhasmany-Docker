"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("./entities/project.entity");
const fs_1 = require("fs");
const path_1 = require("path");
let ProjectsService = class ProjectsService {
    constructor(projectsRepository) {
        this.projectsRepository = projectsRepository;
    }
    async create(createProjectDto, authorId) {
        const project = this.projectsRepository.create({
            ...createProjectDto,
            authorId,
        });
        return this.projectsRepository.save(project);
    }
    async findAll(published) {
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
    async findOne(id) {
        const project = await this.projectsRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
    async findByAuthor(authorId) {
        return this.projectsRepository.find({
            where: { authorId },
            relations: ['author'],
            order: { order: 'ASC', createdAt: 'DESC' },
        });
    }
    async update(id, updateProjectDto) {
        const existingProject = await this.findOne(id);
        if (updateProjectDto.imageUrl && existingProject.imageUrl) {
            await this.deleteImageFile(existingProject.imageUrl);
        }
        if (updateProjectDto.cover && existingProject.cover) {
            await this.deleteImageFile(existingProject.cover);
        }
        await this.projectsRepository.update(id, updateProjectDto);
        return this.findOne(id);
    }
    async deleteImageFile(imageUrl) {
        try {
            const filename = imageUrl.split('/').pop();
            if (!filename)
                return;
            const filePath = (0, path_1.join)(process.cwd(), 'uploads', filename);
            try {
                await fs_1.promises.access(filePath);
                await fs_1.promises.unlink(filePath);
                console.log(`Deleted old image: ${filename}`);
            }
            catch (error) {
                console.log(`Image file not found or already deleted: ${filename}`);
            }
        }
        catch (error) {
            console.error('Error deleting image file:', error);
        }
    }
    async remove(id) {
        const project = await this.findOne(id);
        if (project.imageUrl) {
            await this.deleteImageFile(project.imageUrl);
        }
        if (project.cover) {
            await this.deleteImageFile(project.cover);
        }
        const result = await this.projectsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
    }
    async updateOrder(id, order) {
        await this.projectsRepository.update(id, { order });
        return this.findOne(id);
    }
    async togglePublished(id) {
        const project = await this.findOne(id);
        await this.projectsRepository.update(id, { isPublished: !project.isPublished });
        return this.findOne(id);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map