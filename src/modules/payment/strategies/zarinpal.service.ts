import { randomUUID } from "crypto"
import ZarinPal from "zarinpal-node-sdk"
import { ICreatePayment, IVerifyPayment } from "../interface/zarinPal.interface";
import { Payment } from "../abstract/payment.abstract";

export class ZarinPalService implements Payment {

    private zarinPal: ZarinPal;
    constructor() {
        this.zarinPal = new ZarinPal({
            sandbox: true,
            merchantId: randomUUID()
        })
    }

    async getPaymentAuthority({ amount, description }: { amount: number; description: string; }): Promise<string> {
        // init payment 
        try {
            const resp = (await this.zarinPal.payments.create({
                amount: amount,
                description,
                callback_url: "http://localhost:3000/api/v1/payment/callback/zarinpal"
            })) as ICreatePayment;

            const { authority } = resp.data
            return authority
        } catch (err) {
            throw err;
        }
    }

    getPaymentUrl(authority: string): string {
        return this.zarinPal.payments.getRedirectUrl(authority)
    }

    async verify(authority: string, amount: number) {
        try {
            const res = (await this.zarinPal.verifications.verify({ amount, authority })) as IVerifyPayment
            return res
        } catch (err) { }
    }
}