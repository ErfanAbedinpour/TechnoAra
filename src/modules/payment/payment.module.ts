import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ZarinPalService } from './strategies/zarinpal.service';
import { PaymentGateway } from './strategies/payment.gateway';

@Module({
    controllers: [PaymentController],
    providers: [PaymentService, ZarinPalService, PaymentGateway]
})
export class PaymentModule { }
