import { AppModule } from './infra/data/modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MyLogger } from './applications/utils/logger.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(MyLogger));

  const config = new DocumentBuilder()
    .setTitle('Bot Organizer')
    .setDescription('Bot para gerenciamento de eventos.')
    .setVersion('1.0')
    .addServer('api')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      always: true,
    })
  );

  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  await app.listen(5000);
}
bootstrap();
