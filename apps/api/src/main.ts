// apps/api/src/main.ts
import { clerkMiddleware } from '@clerk/express';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const rawOrigins = config.get<string>('WEB_URL', 'http://localhost:3000');
  const allowedOrigins = rawOrigins.split(',').map((s) => s.trim());

  // ✅ Use Nest’s built-in enableCors (no cors import needed)
  app.enableCors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(clerkMiddleware());

  if (config.get('NODE_ENV') === 'development') {
    setupSwagger(app);
  }

  const port = Number(config.get('API_PORT', 8000));
  await app.listen(port);
  console.log(`🚀 API running on: http://localhost:${port}`);
}
bootstrap();
