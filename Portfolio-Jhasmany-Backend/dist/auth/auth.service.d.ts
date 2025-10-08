import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { EmailService } from '../common/services/email.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private emailService;
    private passwordResetTokenRepository;
    constructor(usersService: UsersService, jwtService: JwtService, emailService: EmailService, passwordResetTokenRepository: Repository<PasswordResetToken>);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        projects: import("../projects/entities/project.entity").Project[];
    }>;
    getProfile(userId: string): Promise<import("../users/entities/user.entity").User>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto, ipAddress?: string, userAgent?: string): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto, ipAddress?: string): Promise<{
        message: string;
    }>;
    validateResetToken(token: string): Promise<{
        valid: boolean;
        message: string;
    }>;
}
