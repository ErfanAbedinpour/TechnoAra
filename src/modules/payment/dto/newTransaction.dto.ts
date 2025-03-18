import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { PaymentMethod } from "../enums/payment-method.enum";
import { Providers } from "../../../models/payment.model";
import { Provider } from "@nestjs/common";

export class TransactionDto {
    @IsEnum(Providers)
    @IsNotEmpty()
    method: Providers

    @IsNotEmpty()
    @IsNumber()
    amount: number

    @IsNumber()
    @IsNotEmpty()
    orderId: number
}