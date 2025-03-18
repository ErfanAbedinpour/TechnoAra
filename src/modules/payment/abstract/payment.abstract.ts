import { IVerifyPayment } from "../interface/zarinPal.interface";

export abstract class Payment {
    abstract getPaymentAuthority(input: { amount: number, description: string }): Promise<string>

    abstract getPaymentUrl(authority: string): string

    abstract verify(authority: string, amount: number): Promise<IVerifyPayment>
}