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
exports.CreateContactDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const sanitize_decorator_1 = require("../../common/decorators/sanitize.decorator");
class CreateContactDto {
}
exports.CreateContactDto = CreateContactDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact person name',
        example: 'John Doe',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Name must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Name must not exceed 100 characters' }),
    (0, sanitize_decorator_1.SanitizeText)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact person email',
        example: 'john@example.com',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Email must not exceed 255 characters' }),
    (0, sanitize_decorator_1.SanitizeEmail)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message subject',
        example: 'Project Inquiry',
        required: false,
        maxLength: 200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Subject must not exceed 200 characters' }),
    (0, sanitize_decorator_1.SanitizeText)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contact message',
        example: 'I would like to discuss a potential project...',
        minLength: 10,
        maxLength: 2000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10, { message: 'Message must be at least 10 characters long' }),
    (0, class_validator_1.MaxLength)(2000, { message: 'Message must not exceed 2000 characters' }),
    (0, sanitize_decorator_1.SanitizeHtml)(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "message", void 0);
//# sourceMappingURL=create-contact.dto.js.map