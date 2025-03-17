import { Injectable } from "@nestjs/common";
import { PaymentGateway } from "./strategies/payment.gateway";

@Injectable()
export class PaymentService {
    constructor(paymentGateway: PaymentGateway) { }

}