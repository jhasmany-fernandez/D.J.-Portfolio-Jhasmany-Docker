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
exports.NewsletterSubscription = void 0;
const typeorm_1 = require("typeorm");
let NewsletterSubscription = class NewsletterSubscription {
};
exports.NewsletterSubscription = NewsletterSubscription;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NewsletterSubscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], NewsletterSubscription.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], NewsletterSubscription.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], NewsletterSubscription.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], NewsletterSubscription.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], NewsletterSubscription.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], NewsletterSubscription.prototype, "isConfirmed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, nullable: true }),
    __metadata("design:type", String)
], NewsletterSubscription.prototype, "confirmationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, nullable: true }),
    __metadata("design:type", String)
], NewsletterSubscription.prototype, "unsubscribeToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'inet', nullable: true }),
    __metadata("design:type", String)
], NewsletterSubscription.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], NewsletterSubscription.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], NewsletterSubscription.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], NewsletterSubscription.prototype, "confirmedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], NewsletterSubscription.prototype, "lastEmailSentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], NewsletterSubscription.prototype, "emailsSentCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], NewsletterSubscription.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], NewsletterSubscription.prototype, "updatedAt", void 0);
exports.NewsletterSubscription = NewsletterSubscription = __decorate([
    (0, typeorm_1.Entity)('newsletter_subscriptions'),
    (0, typeorm_1.Index)(['email'], { unique: true })
], NewsletterSubscription);
//# sourceMappingURL=newsletter-subscription.entity.js.map