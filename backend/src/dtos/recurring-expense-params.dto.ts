import { IsUUID } from "class-validator";

export class RecurringExpenseParamsDto {
  @IsUUID()
  id!: string;
}
