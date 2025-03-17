import { IVerifyPayment } from "../interface/zarinPal.interface";

export abstract class Payment {
    abstract getPaymentUrl(input: { amount: number, description: string }): Promise<string>

    abstract verify(authority: string, amount: number): Promise<IVerifyPayment>
}