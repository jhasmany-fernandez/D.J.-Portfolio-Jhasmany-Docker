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
var NewsletterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto = require("crypto");
const newsletter_subscription_entity_1 = require("./entities/newsletter-subscription.entity");
const email_service_1 = require("../common/services/email.service");
let NewsletterService = NewsletterService_1 = class NewsletterService {
    constructor(newsletterRepository, emailService) {
        this.newsletterRepository = newsletterRepository;
        this.emailService = emailService;
        this.logger = new common_1.Logger(NewsletterService_1.name);
    }
    async subscribe(subscribeDto, ipAddress, userAgent) {
        const { email, firstName, lastName, company, source } = subscribeDto;
        try {
            const existingSubscription = await this.newsletterRepository.findOne({
                where: { email },
            });
            if (existingSubscription && existingSubscription.isActive) {
                return {
                    success: true,
                    message: 'Este email ya se encontraba registrado en nuestro boletín.',
                    alreadySubscribed: true,
                };
            }
            const confirmationToken = crypto.randomBytes(32).toString('hex');
            const unsubscribeToken = crypto.randomBytes(32).toString('hex');
            let subscription;
            if (existingSubscription) {
                existingSubscription.firstName = firstName || existingSubscription.firstName;
                existingSubscription.lastName = lastName || existingSubscription.lastName;
                existingSubscription.company = company || existingSubscription.company;
                existingSubscription.isActive = true;
                existingSubscription.isConfirmed = false;
                existingSubscription.confirmationToken = confirmationToken;
                existingSubscription.unsubscribeToken = unsubscribeToken;
                existingSubscription.ipAddress = ipAddress;
                existingSubscription.userAgent = userAgent;
                existingSubscription.source = source || existingSubscription.source;
                existingSubscription.confirmedAt = null;
                subscription = await this.newsletterRepository.save(existingSubscription);
            }
            else {
                subscription = this.newsletterRepository.create({
                    email,
                    firstName,
                    lastName,
                    company,
                    confirmationToken,
                    unsubscribeToken,
                    ipAddress,
                    userAgent,
                    source: source || 'unknown',
                });
                subscription = await this.newsletterRepository.save(subscription);
            }
            const subscriberName = firstName
                ? `${firstName}${lastName ? ` ${lastName}` : ''}`
                : undefined;
            await this.emailService.sendNewsletterWelcomeEmail(email, confirmationToken, subscriberName, unsubscribeToken);
            this.logger.log(`Newsletter subscription created for: ${email}`);
            return {
                success: true,
                message: 'Please check your email to confirm your subscription.',
                subscriptionId: subscription.id,
            };
        }
        catch (error) {
            this.logger.error(`Failed to create newsletter subscription for ${email}:`, error);
            throw new common_1.BadRequestException('Failed to subscribe to newsletter. Please try again.');
        }
    }
    async confirmSubscription(token) {
        const subscription = await this.newsletterRepository.findOne({
            where: { confirmationToken: token, isActive: true },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Invalid or expired confirmation token');
        }
        if (subscription.isConfirmed) {
            return {
                success: true,
                message: 'Your subscription is already confirmed.',
                alreadyConfirmed: true,
            };
        }
        subscription.isConfirmed = true;
        subscription.confirmedAt = new Date();
        subscription.confirmationToken = null;
        await this.newsletterRepository.save(subscription);
        const subscriberName = subscription.firstName
            ? `${subscription.firstName}${subscription.lastName ? ` ${subscription.lastName}` : ''}`
            : undefined;
        try {
            await this.emailService.sendPortfolioCatalog(subscription.email, subscriberName, subscription.unsubscribeToken);
            subscription.lastEmailSentAt = new Date();
            subscription.emailsSentCount += 1;
            await this.newsletterRepository.save(subscription);
            this.logger.log(`Portfolio catalog sent to confirmed subscriber: ${subscription.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send portfolio catalog to ${subscription.email}:`, error);
        }
        return {
            success: true,
            message: 'Subscription confirmed successfully! Your portfolio catalog has been sent.',
        };
    }
    async unsubscribe(unsubscribeDto) {
        const { token } = unsubscribeDto;
        const subscription = await this.newsletterRepository.findOne({
            where: { unsubscribeToken: token, isActive: true },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Invalid unsubscribe token');
        }
        subscription.isActive = false;
        subscription.unsubscribeToken = null;
        await this.newsletterRepository.save(subscription);
        const subscriberName = subscription.firstName
            ? `${subscription.firstName}${subscription.lastName ? ` ${subscription.lastName}` : ''}`
            : undefined;
        try {
            await this.emailService.sendUnsubscribeConfirmation(subscription.email, subscriberName);
        }
        catch (error) {
            this.logger.error(`Failed to send unsubscribe confirmation to ${subscription.email}:`, error);
        }
        this.logger.log(`Newsletter unsubscribed: ${subscription.email}`);
        return {
            success: true,
            message: 'You have been successfully unsubscribed from our newsletter.',
        };
    }
    async getSubscriptionStats() {
        const [totalSubscriptions, activeSubscriptions, confirmedSubscriptions, todaySubscriptions,] = await Promise.all([
            this.newsletterRepository.count(),
            this.newsletterRepository.count({ where: { isActive: true } }),
            this.newsletterRepository.count({ where: { isActive: true, isConfirmed: true } }),
            this.newsletterRepository.count({
                where: {
                    createdAt: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            }),
        ]);
        return {
            total: totalSubscriptions,
            active: activeSubscriptions,
            confirmed: confirmedSubscriptions,
            today: todaySubscriptions,
            confirmationRate: activeSubscriptions > 0 ? (confirmedSubscriptions / activeSubscriptions * 100).toFixed(2) : '0',
        };
    }
    async sendCatalogToConfirmedSubscribers() {
        const confirmedSubscribers = await this.newsletterRepository.find({
            where: { isActive: true, isConfirmed: true },
            select: ['id', 'email', 'firstName', 'lastName', 'unsubscribeToken'],
        });
        let sentCount = 0;
        let errorCount = 0;
        for (const subscriber of confirmedSubscribers) {
            try {
                const subscriberName = subscriber.firstName
                    ? `${subscriber.firstName}${subscriber.lastName ? ` ${subscriber.lastName}` : ''}`
                    : undefined;
                await this.emailService.sendPortfolioCatalog(subscriber.email, subscriberName, subscriber.unsubscribeToken);
                await this.newsletterRepository.update(subscriber.id, {
                    lastEmailSentAt: new Date(),
                    emailsSentCount: () => 'emailsSentCount + 1',
                });
                sentCount++;
                this.logger.log(`Portfolio catalog sent to: ${subscriber.email}`);
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            catch (error) {
                errorCount++;
                this.logger.error(`Failed to send catalog to ${subscriber.email}:`, error);
            }
        }
        return {
            success: true,
            message: `Portfolio catalog sent to ${sentCount} subscribers.`,
            sent: sentCount,
            errors: errorCount,
            total: confirmedSubscribers.length,
        };
    }
};
exports.NewsletterService = NewsletterService;
exports.NewsletterService = NewsletterService = NewsletterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(newsletter_subscription_entity_1.NewsletterSubscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        email_service_1.EmailService])
], NewsletterService);
//# sourceMappingURL=newsletter.service.js.map