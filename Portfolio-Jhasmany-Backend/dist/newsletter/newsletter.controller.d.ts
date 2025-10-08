import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UnsubscribeNewsletterDto } from './dto/unsubscribe-newsletter.dto';
export declare class NewsletterController {
    private newsletterService;
    constructor(newsletterService: NewsletterService);
    subscribe(subscribeDto: SubscribeNewsletterDto, ipAddress: string, userAgent: string): Promise<{
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
    unsubscribeViaGet(token: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getStats(): Promise<{
        total: number;
        active: number;
        confirmed: number;
        today: number;
        confirmationRate: string;
    }>;
    sendCatalog(): Promise<{
        success: boolean;
        message: string;
        sent: number;
        errors: number;
        total: number;
    }>;
}
