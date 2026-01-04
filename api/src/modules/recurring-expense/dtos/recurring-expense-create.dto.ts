import { Type } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Length,
} from "class-validator";

import { RecurringExpenseType, RecurringFrequency } from "../entities/recurring-expense.entity.js";

export class CreateRecurringExpenseDto {
  @IsNotEmpty()
  @Length(3, 255)
  description!: string;

  @Type(() => Number)
  @IsNumber()
  amount!: number;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsEnum(RecurringFrequency)
  frequency!: RecurringFrequency;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  customIntervalDays?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalInstallments!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  currentInstallment?: number;

  @IsEnum(RecurringExpenseType)
  type!: RecurringExpenseType;

  @IsNotEmpty()
  @IsUUID()
  categoryId!: string;
}
