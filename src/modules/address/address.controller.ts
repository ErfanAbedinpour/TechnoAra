import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { Address } from '../../models/address.model';
import { ResponseStructure } from '../../decorator/resposne-stucture.decorator';
import { HttpExceptionDto } from '../../dtos/http-exception.dto';
import { AddressDto } from './dto/address.dto';

@Controller('address')
@ApiBearerAuth("JWT_AUTH")
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @ApiBody({ type: CreateAddressDto })
  @ApiCreatedResponse({ description: "address added successfully", type: AddressDto })
  @Post()
  create(@GetUser('id') userId: number, @Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(userId, createAddressDto);
  }


  @Get()
  @ApiOkResponse({ description: "fetch addresses successful", type: [AddressDto] })
  @ApiNotFoundResponse({ description: "address not found", type: HttpExceptionDto })
  findAddresses(@GetUser('id') userId: number) {
    return this.addressService.getUserAddresses(userId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.remove(id);
  }
}
