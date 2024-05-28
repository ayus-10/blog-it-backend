import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { BlogService } from "./blog.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateBlogDto } from "./dto/create-blog.dto";

@Controller("blog")
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor("image"))
  create(
    @UploadedFile()
    image: Express.Multer.File,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    return this.blogService.createBlog(image, createBlogDto);
  }
}
