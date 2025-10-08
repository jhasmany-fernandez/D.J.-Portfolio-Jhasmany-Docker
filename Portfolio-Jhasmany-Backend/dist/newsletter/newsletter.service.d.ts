import { Repository } from 'typeorm';
import { NewsletterSubscription } from './entities/newsletter-subscription.entity';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UnsubscribeNewsletterDto } from './dto/unsubscribe-newsletter.dto';
import { EmailService } from '../common/services/email.service';
export declare class NewsletterService {
    private newsletterRepository;
    private emailService;
    private readonly logger;
    constructor(newsletterRepository: Repository<NewsletterSubscription>, emailService: EmailService);
    subscribe(subscribeDto: SubscribeNewsletterDto, ipAddress?: string, userAgent?: string): Promise<{
        success: boolean;
        message: string;
        alreadySubscribed: boolean;
        subscriptionId?: undefined;
    } | {
        success: boolean;
        message: string;
        subscriptionId: string;
        alreadySubscribed?: undefined;
    }>;
    confirmSubscription(token: string): Promise<{
        success: boolean;
        message: string;
        alreadyConfirmed: boolean;
    } | {
        success: boolean;
        message: string;
        alreadyConfirmed?: undefined;
    }>;
    unsubscribe(unsubscribeDto: UnsubscribeNewsletterDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getSubscriptionStats(): Promise<{
        total: number;
        active: number;
        confirmed: number;
        today: number;
        confirmationRate: string;
    }>;
    sendCatalogToConfirmedSubscribers(): Promise<{
        success: boolean;
        message: string;
        sent: number;
        errors: number;
        total: number;
    }>;
}
