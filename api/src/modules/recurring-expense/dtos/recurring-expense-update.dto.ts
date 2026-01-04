import { Type } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Length,
} from "class-validator";

import { RecurringExpenseType, RecurringFrequency } from "../entities/recurring-expense.entity.js";

export class UpdateRecurringExpenseDto {
  @IsOptional()
  @Length(3, 255)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @IsOptional()
  @IsEnum(RecurringFrequency)
  frequency?: RecurringFrequency;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  customIntervalDays?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalInstallments?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  currentInstallment?: number;

  @IsOptional()
  @IsEnum(RecurringExpenseType)
  type?: RecurringExpenseType;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
