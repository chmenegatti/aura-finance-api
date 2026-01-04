import { IsEnum, IsHexColor, IsOptional, IsString, Length } from "class-validator";

import { CategoryType } from "../entities/category.entity.js";

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @Length(1, 120)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 80)
  icon?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;
}
