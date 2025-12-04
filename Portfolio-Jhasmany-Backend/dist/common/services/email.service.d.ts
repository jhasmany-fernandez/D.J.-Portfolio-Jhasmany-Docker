import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    private createTransporter;
    private sendEmail;
    sendPasswordResetEmail(email: string, resetToken: string, userName: string): Promise<void>;
    sendPasswordResetConfirmation(email: string, userName: string): Promise<void>;
    sendNewsletterWelcomeEmail(email: string, confirmationToken: string, subscriberName?: string, unsubscribeToken?: string): Promise<void>;
    sendPortfolioCatalog(email: string, subscriberName?: string, unsubscribeToken?: string): Promise<void>;
    sendUnsubscribeConfirmation(email: string, subscriberName?: string): Promise<void>;
}
