import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class CreateCreditCardExpenseDto {
  @IsNotEmpty()
  @IsString()
  description!: string;

  @Type(() => Number)
  @IsPositive()
  amount!: number;

  @IsDateString()
  purchaseDate!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  installments?: number;
}
