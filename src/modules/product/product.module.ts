import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  exports: [ProductService],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }
