import { IsNotEmpty, IsString } from "class-validator";

export class CommentDto {
  id: string;
  @IsString({ message: "Provided comment is invalid" })
  @IsNotEmpty({ message: "Provided comment is invalid" })
  comment: string;
}
