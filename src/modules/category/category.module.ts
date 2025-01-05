import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  exports: [CategoryService],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule { }
