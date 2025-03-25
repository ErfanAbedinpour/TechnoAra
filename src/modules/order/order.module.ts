import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [CartModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
