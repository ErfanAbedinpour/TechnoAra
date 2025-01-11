import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  productId: number;
}
