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
exports.NewsletterController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const newsletter_service_1 = require("./newsletter.service");
const subscribe_newsletter_dto_1 = require("./dto/subscribe-newsletter.dto");
const unsubscribe_newsletter_dto_1 = require("./dto/unsubscribe-newsletter.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let NewsletterController = class NewsletterController {
    constructor(newsletterService) {
        this.newsletterService = newsletterService;
    }
    async subscribe(subscribeDto, ipAddress, userAgent) {
        return this.newsletterService.subscribe(subscribeDto, ipAddress, userAgent);
    }
    async confirmSubscription(token) {
        return this.newsletterService.confirmSubscription(token);
    }
    async unsubscribe(unsubscribeDto) {
        return this.newsletterService.unsubscribe(unsubscribeDto);
    }
    async unsubscribeViaGet(token) {
        return this.newsletterService.unsubscribe({ token });
    }
    async getStats() {
        return this.newsletterService.getSubscriptionStats();
    }
    async sendCatalog() {
        return this.newsletterService.sendCatalogToConfirmedSubscribers();
    }
};
exports.NewsletterController = NewsletterController;
__decorate([
    (0, common_1.Post)('subscribe'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 300000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Subscribe to newsletter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid email or subscription failed' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Too many requests' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Ip)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscribe_newsletter_dto_1.SubscribeNewsletterDto, String, String]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Get)('confirm'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm newsletter subscription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription confirmed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Invalid confirmation token' }),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "confirmSubscription", null);
__decorate([
    (0, common_1.Post)('unsubscribe'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Unsubscribe from newsletter' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully unsubscribed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Invalid unsubscribe token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [unsubscribe_newsletter_dto_1.UnsubscribeNewsletterDto]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "unsubscribe", null);
__decorate([
    (0, common_1.Get)('unsubscribe'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Unsubscribe from newsletter via GET request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully unsubscribed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Invalid unsubscribe token' }),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "unsubscribeViaGet", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get newsletter subscription statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('send-catalog'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, throttler_1.Throttle)({ default: { limit: 1, ttl: 3600000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Send portfolio catalog to all confirmed subscribers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Catalog sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Too many requests' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "sendCatalog", null);
exports.NewsletterController = NewsletterController = __decorate([
    (0, swagger_1.ApiTags)('Newsletter'),
    (0, common_1.Controller)('newsletter'),
    __metadata("design:paramtypes", [newsletter_service_1.NewsletterService])
], NewsletterController);
//# sourceMappingURL=newsletter.controller.js.map