import { IsUUID } from "class-validator";

export class TransactionParamsDto {
  @IsUUID()
  id!: string;
}
