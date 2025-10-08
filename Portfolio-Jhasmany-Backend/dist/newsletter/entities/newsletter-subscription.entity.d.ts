export declare class NewsletterSubscription {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    isActive: boolean;
    isConfirmed: boolean;
    confirmationToken: string;
    unsubscribeToken: string;
    ipAddress: string;
    userAgent: string;
    source: string;
    confirmedAt: Date;
    lastEmailSentAt: Date;
    emailsSentCount: number;
    createdAt: Date;
    updatedAt: Date;
}
