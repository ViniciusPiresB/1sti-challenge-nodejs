import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PrismaClientExceptionFilter } from './prisma-exception.filter.ts/prisma-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  
  const config = new DocumentBuilder()
    .setTitle("User CRUD")
    .setDescription("An API for a challenge")
    .setVersion("0.1")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("doc", app, document);

  await app.listen(3000);
}
bootstrap();
