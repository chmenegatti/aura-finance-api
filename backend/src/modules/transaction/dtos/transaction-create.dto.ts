import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";

import { TransactionType } from "../entities/transaction.entity.js";

export class CreateTransactionDto {
  @IsString()
  @Length(3, 255)
  description!: string;

  @Type(() => Number)
  @IsNumber()
  amount!: number;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsUUID()
  categoryId!: string;

  @IsDateString()
  date!: string;

  @IsString()
  @Length(2, 80)
  paymentMethod!: string;

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
