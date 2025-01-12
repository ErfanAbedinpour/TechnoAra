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
import { Role } from '../auth/decorator/role.decorator';
import { UserRole } from '../../models/role.model';
import { GetUser } from '../auth/decorator/get-user.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  addProduct(@GetUser("id") userId: number, @Body() createCartDto: CreateCartDto) {
    return this.cartService.addProduct(userId, createCartDto);
  }

  @Get()
  getCart(@Param('userId', ParseIntPipe) id: number) {
    return this.cartService.userCart(id);
  }

  @Delete(':productId')
  removeProduct(@Param('productId', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }

  @Get("/:userId")
  @Role(UserRole.ADMIN)
  getUserCart(@Param("userId", ParseIntPipe) userId: number) {
    return this.cartService.userCart(userId)
  }
}
