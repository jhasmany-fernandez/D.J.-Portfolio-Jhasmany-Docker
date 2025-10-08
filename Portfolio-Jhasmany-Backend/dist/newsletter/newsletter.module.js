"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const newsletter_controller_1 = require("./newsletter.controller");
const newsletter_service_1 = require("./newsletter.service");
const newsletter_subscription_entity_1 = require("./entities/newsletter-subscription.entity");
const email_service_1 = require("../common/services/email.service");
let NewsletterModule = class NewsletterModule {
};
exports.NewsletterModule = NewsletterModule;
exports.NewsletterModule = NewsletterModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([newsletter_subscription_entity_1.NewsletterSubscription])],
        controllers: [newsletter_controller_1.NewsletterController],
        providers: [newsletter_service_1.NewsletterService, email_service_1.EmailService],
        exports: [newsletter_service_1.NewsletterService],
    })
], NewsletterModule);
//# sourceMappingURL=newsletter.module.js.map