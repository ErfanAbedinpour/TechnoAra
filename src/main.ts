import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000

  await app.listen(port, () => {
    console.log(`http://localhost:${port}`)
  });
}
bootstrap();
