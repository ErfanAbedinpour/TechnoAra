import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { Auth, AUTH_STRATEGIES } from "../auth/decorator/auth.decorator";
import { TransactionDto } from "./dto/newTransaction.dto";
import { PaymentService } from "./payment.service";
import { CallBackDto } from "./dto/callback.query.dto";
import { PaymentMethod } from "./enums/payment-method.enum";

@Controller("payment")
@Auth(AUTH_STRATEGIES.NONE)
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    newTransaction(@Body() transactionDto: TransactionDto) {
        return this.paymentService.newTransaction(transactionDto)
    }

    @Get()
    getTransactions() { }

    @Get("callback/zarinpal")
    callBackZarinpal(@Query() { Authority, Status }: CallBackDto) {
        return this.paymentService.verify(Authority, Status, PaymentMethod.ZarinPal)
    }

}