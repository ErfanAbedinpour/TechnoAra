export abstract class Payment {
    abstract getPaymentUrl(input: { amount: number, description: string })

    abstract verify(authority: string, amount: number)
}