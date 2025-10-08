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
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const sanitize_decorator_1 = require("../../common/decorators/sanitize.decorator");
const is_strong_password_decorator_1 = require("../../common/decorators/is-strong-password.decorator");
class CreateUserDto {
    constructor() {
        this.role = 'user';
    }
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User full name',
        example: 'Jhasmany Fernandez',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Name must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Name must not exceed 100 characters' }),
    (0, class_validator_1.Matches)(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, { message: 'Name can only contain letters and spaces' }),
    (0, sanitize_decorator_1.SanitizeText)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'jhasmany@example.com',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Email must not exceed 255 characters' }),
    (0, sanitize_decorator_1.SanitizeEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password - must be strong',
        example: 'MySecure123!',
        minLength: 8,
    }),
    (0, class_validator_1.IsString)(),
    (0, is_strong_password_decorator_1.IsStrongPassword)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User role',
        example: 'user',
        required: false,
        enum: ['user', 'admin'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(user|admin)$/, { message: 'Role must be either user or admin' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
//# sourceMappingURL=create-user.dto.js.map