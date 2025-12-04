"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const compression = require("compression");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    }));
    app.use(compression());
    app.enableCors({
        origin: process.env.NODE_ENV === 'production'
            ? ['http://181.114.111.21', 'https://181.114.111.21']
            : ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:8000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control', 'Pragma'],
        credentials: true,
        maxAge: 86400,
    });
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        validateCustomDecorators: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
            const messages = errors.map((error) => `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`);
            return new Error(`Validation failed: ${messages.join('; ')}`);
        },
    }));
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Portfolio Backend API')
            .setDescription('NestJS backend for Jhasmany Fernandez Portfolio')
            .setVersion('1.0')
            .addBearerAuth()
            .addServer('http://localhost:3001', 'Development')
            .addServer('http://localhost:8001', 'Docker')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    }
    app.setGlobalPrefix('api', {
        exclude: ['health'],
    });
    app.getHttpAdapter().get('/health', (req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
        });
    });
    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
    common_1.Logger.log(`🚀 Application running on: http://0.0.0.0:${port}`, 'Bootstrap');
    if (process.env.NODE_ENV !== 'production') {
        common_1.Logger.log(`📚 Swagger docs: http://0.0.0.0:${port}/api/docs`, 'Bootstrap');
    }
}
bootstrap();
//# sourceMappingURL=main.js.map