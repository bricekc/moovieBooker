import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //https://docs.nestjs.com/openapi/introduction
  const config = new DocumentBuilder()
    //https://docs.nestjs.com/openapi/security#bearer-authentication
    .addBearerAuth()
    .setTitle('MoovieBooker')
    .setDescription('The MoovieBooker API description')
    .setVersion('1.0')
    .addTag('MoovieBooker')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
