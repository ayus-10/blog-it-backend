import { IsEmail, Length } from "class-validator";

export class CreateUserDto {
  @IsEmail(undefined, { message: "Provided email is invalid" })
  email: string;
  @Length(8, undefined, { message: "Password must be at least 8 characters" })
  password: string;
}
