import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { externalImports } from './import/external.import';
import { internalImports } from './import/internal.import';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseSerializerInterceptor } from './interceptor/response-serializer.interceptor';

@Module({
  imports: [
    ...externalImports,
    ...internalImports,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseSerializerInterceptor
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
