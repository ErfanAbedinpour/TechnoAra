import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { ProvinceModule } from '../province/province.module';

@Module({
  imports: [ProvinceModule],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule { }
