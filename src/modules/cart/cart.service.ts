import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { EntityManager, NotFoundError } from '@mikro-orm/postgresql';
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
      // if product does not exist in user Cart Add them
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

  errorHandler(err: Error) {
    if (err instanceof NotFoundError)
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)
  }


  async getUserCart(userId: number) {
    try {
      // findAll User Cart Products
      const userCart = await this.em.findAll(CartProduct, { where: { cart: { user: userId } }, populate: ["product"] });
      return userCart
    } catch (err) {
      this.errorHandler(err)
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }


  async remove(productId: number, userId: number) {
    const userCart = await this.em.findOne(CartProduct, { cart: { user: { id: userId } }, product: productId }, { populate: ['product'] });

    if (!userCart)
      throw new NotFoundException(ErrorMessages.PRODUCT_NOT_EXSIST_IN_YOUR_CART);

    if (userCart.count > 1)
      userCart.count--;
    else
      this.em.remove(userCart)

    try {
      await this.em.flush();

      return userCart
    } catch (err) {
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }
}
