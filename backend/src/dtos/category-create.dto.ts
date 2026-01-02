import { IsEnum, IsHexColor, IsString, Length } from "class-validator";

import { CategoryType } from "../entities/category.entity.js";

export class CreateCategoryDto {
  @IsString()
  @Length(1, 120)
  name!: string;

  @IsString()
  @Length(1, 80)
  icon!: string;

  @IsHexColor()
  color!: string;

  @IsEnum(CategoryType)
  type!: CategoryType;
}
