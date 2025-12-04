import { User } from '../../users/entities/user.entity';
export declare class LoginAttempt {
    id: string;
    email: string;
    ipAddress: string;
    userAgent: string;
    successful: boolean;
    failureReason: string;
    lockedUntil: Date;
    user: User;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
