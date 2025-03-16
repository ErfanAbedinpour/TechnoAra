import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
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
  findAddresses(@GetUser('id') userId: number) {
    return this.addressService.getUserAddresses(userId);
  }

  @Get(":id")
  @ApiParam({ name: "id" })
  @ApiOkResponse({ description: "fetch addresses successful", type: AddressDto })
  @ApiNotFoundResponse({ description: "address not found", type: HttpExceptionDto })
  getAddress(@Param("id", ParseIntPipe) id: number, @GetUser('id') userId: number) {
    return this.addressService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiParam({ name: "id" })
  @ApiBody({ type: UpdateAddressDto })
  @ApiOkResponse({ description: "updated successfully", type: AddressDto })
  @ApiNotFoundResponse({ description: "address not found", type: HttpExceptionDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @ApiParam({ name: "id" })
  @ApiNotFoundResponse({ description: "address not found" })
  @ApiOkResponse({ description: "address removed successful", type: AddressDto })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.remove(id);
  }
}
