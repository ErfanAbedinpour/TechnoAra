import { Injectable } from "@nestjs/common";
import { Payment } from "../abstract/payment.abstract";
import { PaymentMethod } from "../enums/payment-method.enum";
import { ZarinPalService } from "./zarinpal.service";
import { Providers } from "../../../models/payment.model";

@Injectable()
export class PaymentGateway {
    private paymentContainer: {};
    constructor(private zarinPalService: ZarinPalService) {
        // register another payment method here
        this.paymentContainer = {
            [Providers.ZARINPAL]: this.zarinPalService
        }
    }

    getPayment(method: Providers): Payment {
        return this.paymentContainer[method]
    }
}