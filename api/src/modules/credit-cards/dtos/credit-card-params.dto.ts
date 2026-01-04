import { IsUUID } from "class-validator";

export class CreditCardParamsDto {
  @IsUUID()
  id!: string;
}
