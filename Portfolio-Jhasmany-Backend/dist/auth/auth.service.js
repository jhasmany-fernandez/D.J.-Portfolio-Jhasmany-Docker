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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const users_service_1 = require("../users/users.service");
const password_reset_token_entity_1 = require("./entities/password-reset-token.entity");
const login_attempt_entity_1 = require("./entities/login-attempt.entity");
const email_service_1 = require("../common/services/email.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, emailService, passwordResetTokenRepository, loginAttemptRepository) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.loginAttemptRepository = loginAttemptRepository;
    }
    async validateUser(email, password, ipAddress, userAgent) {
        const isLocked = await this.isAccountLocked(email, ipAddress);
        if (isLocked) {
            await this.recordLoginAttempt(email, ipAddress, userAgent, false, 'Account locked');
            throw new common_1.UnauthorizedException('Account is temporarily locked due to multiple failed login attempts. Try again later.');
        }
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            await this.resetFailedAttempts(email, ipAddress);
            await this.recordLoginAttempt(email, ipAddress, userAgent, true, null, user.id);
            const { password, ...result } = user;
            return result;
        }
        await this.recordLoginAttempt(email, ipAddress, userAgent, false, 'Invalid credentials');
        const failedAttempts = await this.getRecentFailedAttempts(email, ipAddress);
        if (failedAttempts >= 3) {
            await this.lockAccount(email, ipAddress);
            throw new common_1.UnauthorizedException('Account locked due to multiple failed login attempts. Try again in 15 minutes.');
        }
        return null;
    }
    async login(loginDto, ipAddress, userAgent) {
        const user = await this.validateUser(loginDto.email, loginDto.password, ipAddress, userAgent);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isLocked = await this.isAccountLocked(user.email, ipAddress);
        if (isLocked) {
            throw new common_1.UnauthorizedException('Account is temporarily locked. Try again later.');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
    async register(createUserDto) {
        const existingUser = await this.usersService.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.UnauthorizedException('User already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
        });
        const { password, ...result } = user;
        return result;
    }
    async getProfile(userId) {
        return this.usersService.findOne(userId);
    }
    async forgotPassword(forgotPasswordDto, ipAddress, userAgent) {
        const { email } = forgotPasswordDto;
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return { message: 'If the email exists, a password reset link has been sent.' };
        }
        await this.passwordResetTokenRepository.update({ userId: user.id, isUsed: false }, { isUsed: true });
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        const passwordResetToken = this.passwordResetTokenRepository.create({
            token: resetToken,
            userId: user.id,
            expiresAt,
            ipAddress,
            userAgent,
        });
        await this.passwordResetTokenRepository.save(passwordResetToken);
        try {
            await this.emailService.sendPasswordResetEmail(user.email, resetToken, user.name);
        }
        catch (error) {
            console.error('Failed to send password reset email:', error);
        }
        return { message: 'If the email exists, a password reset link has been sent.' };
    }
    async resetPassword(resetPasswordDto, ipAddress) {
        const { token, newPassword, confirmPassword } = resetPasswordDto;
        if (newPassword !== confirmPassword) {
            throw new common_1.BadRequestException('Passwords do not match');
        }
        const resetToken = await this.passwordResetTokenRepository.findOne({
            where: {
                token,
                isUsed: false
            },
            relations: ['user'],
        });
        if (!resetToken) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        if (new Date() > resetToken.expiresAt) {
            throw new common_1.BadRequestException('Reset token has expired');
        }
        if (!resetToken.user || !resetToken.user.isActive) {
            throw new common_1.BadRequestException('User account is not active');
        }
        const isSamePassword = await bcrypt.compare(newPassword, resetToken.user.password);
        if (isSamePassword) {
            throw new common_1.BadRequestException('New password must be different from current password');
        }
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            await this.usersService.updatePassword(resetToken.user.id, hashedPassword);
            await this.passwordResetTokenRepository.update({ id: resetToken.id }, { isUsed: true });
            await this.passwordResetTokenRepository.update({ userId: resetToken.user.id, isUsed: false }, { isUsed: true });
            try {
                await this.emailService.sendPasswordResetConfirmation(resetToken.user.email, resetToken.user.name);
            }
            catch (error) {
                console.error('Failed to send password reset confirmation email:', error);
            }
            return { message: 'Password has been reset successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to reset password. Please try again.');
        }
    }
    async validateResetToken(token) {
        const resetToken = await this.passwordResetTokenRepository.findOne({
            where: {
                token,
                isUsed: false
            },
        });
        if (!resetToken) {
            return { valid: false, message: 'Invalid reset token' };
        }
        if (new Date() > resetToken.expiresAt) {
            return { valid: false, message: 'Reset token has expired' };
        }
        return { valid: true, message: 'Token is valid' };
    }
    async recordLoginAttempt(email, ipAddress, userAgent, successful = false, failureReason, userId) {
        const loginAttempt = this.loginAttemptRepository.create({
            email,
            ipAddress,
            userAgent,
            successful,
            failureReason,
            userId,
        });
        await this.loginAttemptRepository.save(loginAttempt);
    }
    async getRecentFailedAttempts(email, ipAddress) {
        const fifteenMinutesAgo = new Date();
        fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);
        const whereClause = {
            email,
            successful: false,
            createdAt: (0, typeorm_2.MoreThanOrEqual)(fifteenMinutesAgo),
        };
        if (ipAddress) {
            whereClause.ipAddress = ipAddress;
        }
        const count = await this.loginAttemptRepository.count({
            where: whereClause,
        });
        return count;
    }
    async isAccountLocked(email, ipAddress) {
        const now = new Date();
        const whereClause = {
            email,
            lockedUntil: (0, typeorm_2.MoreThan)(now),
        };
        if (ipAddress) {
            whereClause.ipAddress = ipAddress;
        }
        const lockedAttempt = await this.loginAttemptRepository.findOne({
            where: whereClause,
        });
        return !!lockedAttempt;
    }
    async lockAccount(email, ipAddress) {
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + 15);
        const loginAttempt = this.loginAttemptRepository.create({
            email,
            ipAddress,
            successful: false,
            failureReason: 'Account locked due to multiple failed attempts',
            lockedUntil: lockUntil,
        });
        await this.loginAttemptRepository.save(loginAttempt);
    }
    async resetFailedAttempts(email, ipAddress) {
        const whereClause = {
            email,
            successful: false,
        };
        if (ipAddress) {
            whereClause.ipAddress = ipAddress;
        }
        await this.loginAttemptRepository.delete(whereClause);
    }
    async unlockAccount(email) {
        await this.loginAttemptRepository.update({ email, lockedUntil: (0, typeorm_2.MoreThan)(new Date()) }, { lockedUntil: null });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(password_reset_token_entity_1.PasswordResetToken)),
    __param(4, (0, typeorm_1.InjectRepository)(login_attempt_entity_1.LoginAttempt)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map