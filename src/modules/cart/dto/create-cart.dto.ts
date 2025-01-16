import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  productId: number;
}
