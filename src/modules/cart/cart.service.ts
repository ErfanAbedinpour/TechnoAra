import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { ProductService } from '../product/product.service';
import { CartProduct } from '../../models/cart-product.model';
import { ErrorMessages } from '../../errorResponse/err.response';
import { Cart } from '../../models/cart.model';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name)

  constructor(private readonly em: EntityManager, private readonly productService: ProductService) { }

  async addProduct(userId: number, { productId }: CreateCartDto) {

    const product = await this.productService.getProductById(productId)
    // if product does not have enought quantity throw Error

    if (product.inventory < 1)
      throw new BadRequestException(ErrorMessages.PRODUCT_QUANTITY)

    try {
      const userCart = await this.em.findOne(Cart, { user: userId })

      let userCartProduct = await this.em.findOne(CartProduct, { $and: [{ cart: userCart }, { product: productId }] }, { populate: ['product', 'cart'] })
      // if product does not exsist in user Cart Add them
      if (!userCartProduct)
        userCartProduct = this.em.create(CartProduct, { cart: userCart, product: productId, count: 1 }, { persist: true })

      else if (product.inventory - userCartProduct.count >= 1) {
        // if exsist increase Product Quantity in User Cart
        userCartProduct.count++;

      } else
        throw new BadRequestException(ErrorMessages.PRODUCT_QUANTITY)

      await this.em.flush();

      return userCartProduct

    } catch (err) {
      if (err instanceof HttpException)
        throw err;

      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }

  showCart() {
    return `This action returns all cart`;
  }

  userCart(userId: number) {
    return `This action returns a #${userId} cart`;
  }


  remove(productId: number) {
    return `This action removes a #${productId} cart`;
  }
}
