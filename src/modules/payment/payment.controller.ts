import { Controller, Get, Post } from "@nestjs/common";
import { Auth, AUTH_STRATEGIES } from "../auth/decorator/auth.decorator";

@Controller("payment")
// @Auth(AUTH_STRATEGIES.BEARER)
export class PaymentController {
    @Post()
    newTransaction() { }

    @Get()
    getTransactions() { }
}