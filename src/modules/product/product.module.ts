import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { StorageModule } from '../storage/storage.module';
import { ProductStorage } from './storage/product-storage.service';

@Module({
  imports: [StorageModule],
  exports: [ProductService],
  controllers: [ProductController],
  providers: [ProductService, ProductStorage],
})
export class ProductModule { }
