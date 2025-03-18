import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PaymentGateway } from "./strategies/payment.gateway";
import { TransactionDto } from "./dto/newTransaction.dto";
import { PaymentMethod } from "./enums/payment-method.enum";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { Payment, PaymentStatus } from "../../models/payment.model";
import { ErrorMessages } from "../../errorResponse/err.response";
import Decimal from "decimal.js";

@Injectable()
export class PaymentService {
    constructor(
        private paymentGateway: PaymentGateway,
        private readonly em: EntityManager
    ) { }

    async requestPayment({ amount, method, orderId }: TransactionDto, userId: number) {
        try {
            const provider = this.paymentGateway.getPayment(method)
            const authority = await provider.getPaymentAuthority({ amount, description: "this is description" });
            const url = provider.getPaymentUrl(authority);
            this.em.create(Payment, { authority, amount, provider: method, userId, orderId }, { persist: true });
            await this.em.flush()
            return url;
        } catch (err) {
            throw new InternalServerErrorException(err.message)
        }
    }

    errorHandler(err: unknown) {
        if (err instanceof NotFoundError)
            throw new NotFoundException(ErrorMessages.PAYMENT_NOT_FOUND)
    }

    async verify(authority: string, status: string) {
        try {
            const payment = await this.em.findOneOrFail(Payment, { authority })

            if (status !== 'OK') {
                payment.status = PaymentStatus.FAILED
                await this.em.persistAndFlush(payment)

                return {
                    success: false,
                    msg: "Transaction was cancel"
                }
            }

            const provider = this.paymentGateway.getPayment(payment.provider);
            const { data: { ref_id, code } } = await provider.verify(authority, Number(payment.amount));

            payment.transactionId = String(ref_id);
            payment.status = code === 100 || code === 101 ? PaymentStatus.SUCCESS : PaymentStatus.FAILED
            await this.em.persistAndFlush(payment)

            return {
                success: true,
                TransactionId: ref_id
            }
        } catch (err) {
            this.errorHandler(err)
            throw new InternalServerErrorException()
        }
    }
}