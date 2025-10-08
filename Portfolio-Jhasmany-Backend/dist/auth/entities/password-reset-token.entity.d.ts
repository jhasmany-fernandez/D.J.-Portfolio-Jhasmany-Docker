import { User } from '../../users/entities/user.entity';
export declare class PasswordResetToken {
    id: string;
    token: string;
    userId: string;
    user: User;
    expiresAt: Date;
    isUsed: boolean;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
}
