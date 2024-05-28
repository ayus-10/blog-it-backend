import { IsString, MinLength } from "class-validator";

export class CreateBlogDto {
  @IsString({ message: "Provided title is invalid" })
  @MinLength(20, { message: "Title must contain at least 20 characters" })
  title: string;
  @IsString({ message: "Provided category is invalid" })
  category: string;
  @IsString({ message: "Provided content is invalid" })
  @MinLength(100, { message: "Title must contain at least 100 characters" })
  content: string;
}
