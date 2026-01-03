import { IsDateString, IsOptional } from "class-validator";

export class DashboardParamsDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
