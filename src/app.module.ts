import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { externalImports } from './import/external.import';
import { internalImports } from './import/internal.import';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    ...externalImports,
    ...internalImports,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
