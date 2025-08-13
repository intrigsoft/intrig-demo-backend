import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // OpenAPI 3 configuration
  const config = new DocumentBuilder()
    .setTitle('Intrig Demo Backend API')
    .setDescription('API documentation for the Intrig Demo Backend')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  // Expose swagger.json endpoint
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/swagger.json', (req, res) => {
    res.json(document);
  });
  
  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
