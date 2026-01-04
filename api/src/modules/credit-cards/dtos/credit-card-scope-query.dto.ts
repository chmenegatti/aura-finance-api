import { IsIn, IsOptional } from "class-validator";

export class CreditCardExpenseScopeQueryDto {
  @IsOptional()
  @IsIn(["single", "group"])
  scope?: "single" | "group";
}
