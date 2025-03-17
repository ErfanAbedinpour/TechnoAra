import { Injectable } from "@nestjs/common";
import { Payment } from "../abstract/payment.abstract";
import { PaymentMethod } from "../enums/payment-method.enum";
import { ZarinPalService } from "./zarinpal.service";

@Injectable()
export class PaymentGateway {
    private paymentContainer: {};
    constructor(private zarinPalService: ZarinPalService) {
        // register another payment method here
        this.paymentContainer = {
            [PaymentMethod.ZarinPal]: this.zarinPalService
        }
    }

    getPayment(method: PaymentMethod): Payment {
        return this.paymentContainer[method]
    }
}