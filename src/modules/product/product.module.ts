import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { StorageModule } from '../storage/storage.module';
import { ProductImageProcessor } from './processor/product-storage.service';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from '../../enums/queues.enum';

@Module({
  imports: [StorageModule, BullModule.registerQueue({ name: QUEUES.PRODUCT_FILE })],
  exports: [ProductService],
  controllers: [ProductController],
  providers: [ProductService, ProductImageProcessor],
})
export class ProductModule { }
