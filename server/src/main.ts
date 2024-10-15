import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@shared/infra/filters/exeption.filter';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  const docsConfig = new DocumentBuilder()
    .setTitle("TextMe Server Docs")
    .setDescription("This is the TextMe application Server which is responsible for handling all users, friendships and chat operations.")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
    
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  });

  const document = SwaggerModule.createDocument(app, docsConfig)
  SwaggerModule.setup("docs", app, document)

  await app.listen(3333);
}
bootstrap();
