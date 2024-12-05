import { Module } from '@nestjs/common';
import { externalImports } from './import/external.import';
import { internalImports } from './import/internal.import';

@Module({
  imports: [
    ...externalImports,
    ...internalImports
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
