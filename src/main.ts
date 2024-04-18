import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { graphqlUploadExpress } from 'graphql-upload';

const maxFileSize = 1000 * 1000 * 500;
const maxFiles = 220;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use('/graphql', graphqlUploadExpress({ maxFileSize, maxFiles }));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // true일 경우 validation decorator가 붙어있지 않는 속성들은 제거
      forbidNonWhitelisted: false, // true일 경우 DTO에 존재하지 않는 값이 들어올 경우 에러, 이미지 경우 false로 해야 인식한다.
      transform: true, // 모든 데이터는 string으로 전달되는데 true일 경우 DTO에 도달할 때 형변환 시켜준다.
    }),
  );

  await app.listen(configService.get('PORT'), '0.0.0.0');
}
bootstrap();
