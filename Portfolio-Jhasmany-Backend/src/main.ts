import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  // Compression
  app.use(compression());

  // Enhanced CORS with security
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? ['http://181.114.111.21', 'https://181.114.111.21']
      : ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:8000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control', 'Pragma'],
    credentials: true,
    maxAge: 86400, // 24 hours
  });

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Enhanced validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validateCustomDecorators: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const messages = errors.map(
          (error) => `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`
        );
        return new Error(`Validation failed: ${messages.join('; ')}`);
      },
    }),
  );

  // Swagger documentation (only in non-production)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Portfolio Backend API')
      .setDescription('NestJS backend for Jhasmany Fernandez Portfolio')
      .setVersion('1.0')
      .addBearerAuth()
      .addServer('http://localhost:3001', 'Development')
      .addServer('http://localhost:8001', 'Docker')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  // Global prefix
  app.setGlobalPrefix('api', {
    exclude: ['health'],
  });

  // Health check endpoint
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

  Logger.log(`🚀 Application running on: http://0.0.0.0:${port}`, 'Bootstrap');
  if (process.env.NODE_ENV !== 'production') {
    Logger.log(`📚 Swagger docs: http://0.0.0.0:${port}/api/docs`, 'Bootstrap');
  }
}

bootstrap();