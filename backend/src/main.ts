import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'aws-sdk';

//const port = process.env.PORT || 4000; 


async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });
  app.useGlobalPipes(new ValidationPipe());
  const configDoc = new DocumentBuilder()  
  .addBearerAuth()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, configDoc);
  SwaggerModule.setup('api-doc', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });


  app.enableCors();
  // app.setGlobalPrefix('api');
  await app.listen(4001);
}
bootstrap();
