import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { StorageModule } from '../storage/storage.module';
import { ProductImageProcessor } from './processor/product-storage.service';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../../enums/queues.enum';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHandler } from './handler/create-product.handler';
import { ProductByIdHandler } from './handler/product-by-id.handler';
import { FindProductHandler } from './handler/get-product.handler';

@Module({
  imports: [StorageModule, BullModule.registerQueue({ name: QUEUES.PRODUCT_FILE }), CqrsModule],
  exports: [ProductService],
  controllers: [ProductController],
  providers: [ProductService, ProductImageProcessor, CreateProductHandler, ProductByIdHandler, FindProductHandler],
})
export class ProductModule { }
