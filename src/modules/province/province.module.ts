import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';

@Module({
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvinceModule {}
