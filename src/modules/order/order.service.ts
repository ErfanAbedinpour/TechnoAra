import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { EntityManager, NotFoundError } from '@mikro-orm/postgresql';
import { Cart } from '../../models/cart.model';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(private readonly em: EntityManager, private readonly cartService: CartService) { }
  private logger = new Logger(OrderService.name)

  async create(userId: number) {
    try {
      /**
       * 1. FindUserProducts
       * 2. Calculate Products Price
       * 3. Sign OrderNumber
       * 4. Register Order
       */
      const products = await this.cartService.getUserCartProducts(userId);

      return 'This action adds a new order';

    } catch (ex) {
      if (ex instanceof NotFoundError) {
        this.logger.warn(ex.message)
        throw new BadRequestException("could'n found UserCart")
      }
      this.logger.error(ex)
    }

  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
