import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateCreditCardExpenseDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount?: number;
}
