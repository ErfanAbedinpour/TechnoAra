import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  await app.get(MikroORM).getSchemaGenerator().ensureDatabase();

  // Set Prefix
  app.setGlobalPrefix(process.env.PREFIX)

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: process.env.VERSION
  })

  // config for DocuemtnBuilder (swagger)
  const config = new DocumentBuilder()
    .setTitle('TechnoAra Api ')
    .setDescription('The technoAra API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, documentFactory);

  await app.listen(port, () => {
    console.log(`http://localhost:${port}`)
  });
}
bootstrap();
