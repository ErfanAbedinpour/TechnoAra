import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';

@Module({
  exports: [BrandService],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule { }
