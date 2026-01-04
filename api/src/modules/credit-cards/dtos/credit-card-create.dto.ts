import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsString, Length, Max, Min } from "class-validator";

export class CreateCreditCardDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  brand!: string;

  @IsNotEmpty()
  @Length(4, 4)
  lastFourDigits!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  creditLimit!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  closingDay!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  dueDay!: number;
}
