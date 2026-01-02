import { IsEmail, IsString, Length } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @Length(2, 120)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 72)
  password!: string;
}
