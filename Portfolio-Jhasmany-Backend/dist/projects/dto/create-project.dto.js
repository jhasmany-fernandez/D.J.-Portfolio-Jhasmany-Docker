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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProjectDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateProjectDto {
}
exports.CreateProjectDto = CreateProjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project title',
        example: 'Portfolio Website',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project description',
        example: 'A modern portfolio website built with Next.js and NestJS',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project detailed content',
        example: 'This project showcases...',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Technologies used',
        example: ['Next.js', 'NestJS', 'PostgreSQL', 'Docker'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "technologies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project image URL',
        example: 'https://example.com/image.jpg',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Demo URL',
        example: 'https://portfolio-demo.com',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "demoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'GitHub repository URL',
        example: 'https://github.com/user/project',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "githubUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project order for display',
        example: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the project is published',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectDto.prototype, "isPublished", void 0);
//# sourceMappingURL=create-project.dto.js.map