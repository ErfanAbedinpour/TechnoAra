import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('order')
@ApiBearerAuth("JWT_AUTH")
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  create(@GetUser('id') userId: number) {
    return this.orderService.create(userId);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
