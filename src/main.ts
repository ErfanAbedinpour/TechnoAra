import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.get(MikroORM).getSchemaGenerator().ensureDatabase();

  await app.get(MikroORM).getSchemaGenerator().updateSchema();

  app.setGlobalPrefix("api")
  await app.listen(port, () => {
    console.log(`http://localhost:${port}`)
  });
}
bootstrap();
