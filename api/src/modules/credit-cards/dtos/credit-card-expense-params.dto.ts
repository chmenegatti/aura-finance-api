import { IsUUID } from "class-validator";

export class CreditCardExpenseParamsDto {
  @IsUUID()
  expenseId!: string;
}
