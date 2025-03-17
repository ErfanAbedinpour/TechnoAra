import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PaymentGateway } from "./strategies/payment.gateway";
import { TransactionDto } from "./dto/newTransaction.dto";
import { PaymentMethod } from "./enums/payment-method.enum";

@Injectable()
export class PaymentService {
    constructor(private paymentGateway: PaymentGateway) { }

    async newTransaction({ amount, method }: TransactionDto) {
        try {
            const url = await this.paymentGateway.getPayment(method).getPaymentUrl({ amount, description: "this is description" });
            return url
        } catch (err) {
            throw new InternalServerErrorException(err.message)
        }
    }


    async verify(authority: string, Status: string, method: PaymentMethod) {
        // TODO: Get Amount of authority from DB
        // TODO: Validate them
        const { data: { ref_id } } = await this.paymentGateway.getPayment(method).verify(authority, 10000)
    }
}