import { IsUUID } from "class-validator";

export class CreditCardRouteParamsDto {
  @IsUUID()
  cardId!: string;
}
