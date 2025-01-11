import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('cart/:userId')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addProduct(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  findOne(@Param('userId', ParseIntPipe) id: number) {
    return this.cartService.findOne(id);
  }

  @Delete(':productId')
  remove(@Param('productId', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }
}
