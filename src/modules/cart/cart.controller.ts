import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Role } from '../auth/decorator/role.decorator';
import { UserRole } from '../../models/role.model';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @ApiBody({ type: CreateCartDto })
  @ApiOkResponse({ description: "product added successfully" })
  @Post()
  @HttpCode(HttpStatus.OK)
  addProduct(@GetUser("id") userId: number, @Body() createCartDto: CreateCartDto) {
    return this.cartService.addProduct(userId, createCartDto);
  }

  @Get()
  getCart(@GetUser('id') id: number) {
    return this.cartService.getUserCart(id);
  }

  @Delete(':productId')
  removeProduct(@GetUser('id') userId: number, @Param('productId', ParseIntPipe) id: number) {
    return this.cartService.remove(id, userId);
  }

  @Get("/:userId")
  @Role(UserRole.ADMIN)
  getUserCart(@Param("userId", ParseIntPipe) userId: number) {
    return this.cartService.getUserCart(userId)
  }
}
