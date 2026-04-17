import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://slooze-food-ordering.vercel.app',
      'https://slooze-food-ordering-git-main-guddu-kumars-projects-9014a0ff.vercel.app',
    ],
    credentials: true,
  });
  await app.listen(4000);
  console.log('Backend running on http://localhost:4000/graphql');
}
bootstrap();
