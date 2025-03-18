import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { Auth, AUTH_STRATEGIES } from "../auth/decorator/auth.decorator";
import { TransactionDto } from "./dto/newTransaction.dto";
import { PaymentService } from "./payment.service";
import { CallBackDto } from "./dto/callback.query.dto";
import { GetUser } from "../auth/decorator/get-user.decorator";

@Controller("payment")
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    @Auth(AUTH_STRATEGIES.BEARER)
    newTransaction(@Body() transactionDto: TransactionDto, @GetUser("id") userId: number) {
        return this.paymentService.requestPayment(transactionDto, userId)
    }

    @Get("callback/zarinpal")
    callBackZarinpal(@Query() { Authority, Status }: CallBackDto) {
        return this.paymentService.verify(Authority, Status)
    }

}