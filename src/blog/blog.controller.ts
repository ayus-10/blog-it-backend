import {
  Body,
  Controller,
  Post,
  Req,
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
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import { AuthService } from "src/auth/auth.service";

@UseGuards(AuthGuard)
@Controller("blog")
export class BlogController {
  constructor(
    private blogService: BlogService,
    private authService: AuthService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./public/uploads",
        filename: (_req, file, callback) => {
          const names = file.originalname.split(".");
          const fileExtension = names[names.length - 1];
          const newFileName = uuidv4() + "." + fileExtension;
          callback(undefined, newFileName);
        },
      }),
    }),
  )
  async create(
    @UploadedFile(ImageValidationPipe)
    image: Express.Multer.File,
    @Req() req: Request,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    const currentUser = await this.authService.authorizeUser(req);
    return await this.blogService.createBlog(currentUser, image, createBlogDto);
  }
}
