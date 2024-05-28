import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { BlogService } from "./blog.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { ImageValidationPipe } from "src/pipes/image-validation.pipe";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("blog")
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor("image"))
  create(
    @UploadedFile(ImageValidationPipe)
    image: Express.Multer.File,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    return this.blogService.createBlog(image, createBlogDto);
  }
}
