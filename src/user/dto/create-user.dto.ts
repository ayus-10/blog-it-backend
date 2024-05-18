import { IsAlphanumeric, IsEmail, Length } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsAlphanumeric()
  @Length(8)
  password: string;
}
