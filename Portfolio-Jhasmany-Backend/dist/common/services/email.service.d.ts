import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    sendPasswordResetEmail(email: string, resetToken: string, userName: string): Promise<void>;
    sendPasswordResetConfirmation(email: string, userName: string): Promise<void>;
    sendNewsletterWelcomeEmail(email: string, confirmationToken: string, subscriberName?: string, unsubscribeToken?: string): Promise<void>;
    sendPortfolioCatalog(email: string, subscriberName?: string, unsubscribeToken?: string): Promise<void>;
    sendUnsubscribeConfirmation(email: string, subscriberName?: string): Promise<void>;
}
