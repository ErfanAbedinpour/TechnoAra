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
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiForbiddenResponse, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { CartDto, ProductDto } from './dto/create-cart-response';



@Controller('cart')
@ApiBearerAuth("JWT_AUTH")
@ApiExtraModels(CartDto, ProductDto)
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @ApiBody({ type: CreateCartDto })
  @ApiOkResponse({
    description: "product added successfully", schema: {
      allOf: [
        {
          properties: {
            cart: {
              $ref: getSchemaPath(CartDto)
            },
            product: {
              $ref: getSchemaPath(ProductDto)
            },
            count: {
              type: 'number'
            }
          }

        }
      ],
    }
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  addProduct(@GetUser("id") userId: number, @Body() createCartDto: CreateCartDto) {
    return this.cartService.addProduct(userId, createCartDto);
  }

  @Get()
  @ApiOkResponse({
    description: "get UserCart Successfully",
    isArray: true,
    schema: {
      type: 'array',
      items: {
        properties: {
          cart: { type: 'number' },
          product: {
            $ref: getSchemaPath(ProductDto)
          },
          count: {
            type: 'number'
          }
        }
      },

    }
  })
  getCart(@GetUser('id') id: number) {
    return this.cartService.getUserCartProducts(id);
  }

  @Delete(':productId')
  @ApiOkResponse({
    description: "get UserCart Successfully",
    schema: {
      properties: {
        cart: { type: 'number' },
        product: {
          $ref: getSchemaPath(ProductDto)
        },
        count: {
          type: 'number'
        }
      }
    }
  })
  removeProduct(@GetUser('id') userId: number, @Param('productId', ParseIntPipe) id: number) {
    return this.cartService.remove(id, userId);
  }

  @Get("/:userId")
  @Role(UserRole.ADMIN)
  @ApiForbiddenResponse({ description: "only admin can access this endpoint" })
  @ApiOkResponse({
    description: "get UserCart Successfully",
    isArray: true,
    schema: {
      type: 'array',
      items: {
        properties: {
          cart: { type: 'number' },
          product: {
            $ref: getSchemaPath(ProductDto)
          },
          count: {
            type: 'number'
          }
        }
      },

    }
  })
  getUserCart(@Param("userId", ParseIntPipe) userId: number) {
    return this.cartService.getUserCartProducts(userId)
  }
}
