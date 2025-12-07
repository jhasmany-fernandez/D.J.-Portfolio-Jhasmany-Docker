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
        description: 'Project short description',
        example: 'A modern portfolio website',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "shortDescription", void 0);
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
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project cover image URL',
        example: 'https://example.com/cover.jpg',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "cover", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Demo URL',
        example: 'https://portfolio-demo.com',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "demoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Live preview URL',
        example: 'https://portfolio-demo.com',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "livePreview", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'GitHub repository URL',
        example: 'https://github.com/user/project',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "githubUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'GitHub link',
        example: 'https://github.com/user/project',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "githubLink", void 0);
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
        description: 'Project priority',
        example: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project type',
        example: 'Client Work 🙍‍♂️',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of visitors',
        example: '8K Visitors',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "visitors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount earned',
        example: '$400',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "earned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'GitHub stars',
        example: '40 Stars',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "githubStars", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of sales',
        example: '138 Sales',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "numberOfSales", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Site age',
        example: '1 month old',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "siteAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ratings',
        example: '4.5/5',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "ratings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Show live preview in portfolio',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectDto.prototype, "showLivePreviewInPortfolio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Show GitHub link in portfolio',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectDto.prototype, "showGithubInPortfolio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Show visitors in portfolio',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectDto.prototype, "showVisitorsInPortfolio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Show earned in portfolio',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectDto.prototype, "showEarnedInPortfolio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Show GitHub stars in portfolio',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectDto.prototype, "showGithubStarsInPortfolio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Show ratings in portfolio',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectDto.prototype, "showRatingsInPortfolio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Show number of sales in portfolio',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectDto.prototype, "showNumberOfSalesInPortfolio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Show site age in portfolio',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProjectDto.prototype, "showSiteAgeInPortfolio", void 0);
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