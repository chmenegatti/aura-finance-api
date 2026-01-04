import { IsEmail, IsString, Length } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 72)
  password!: string;
}
