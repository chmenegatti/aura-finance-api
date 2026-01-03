import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";

import { TransactionType } from "../entities/transaction.entity.js";

export class UpdateTransactionDto {
  @IsOptional()
  @IsString()
  @Length(3, 255)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  @Length(2, 80)
  paymentMethod?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  @Length(3, 500)
  notes?: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;
}
