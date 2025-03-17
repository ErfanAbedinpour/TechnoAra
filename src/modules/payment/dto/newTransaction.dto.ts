import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { PaymentMethod } from "../enums/payment-method.enum";

export class TransactionDto {
    @IsEnum(PaymentMethod)
    @IsNotEmpty()
    method: PaymentMethod

    @IsNotEmpty()
    @IsNumber()
    amount: number
}