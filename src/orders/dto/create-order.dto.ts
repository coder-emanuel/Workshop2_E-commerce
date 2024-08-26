import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsNotEmpty()
  productIds: string[];
}
