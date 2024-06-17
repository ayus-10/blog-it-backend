import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CommentDto } from "./dto/comment.dto";

@Controller("blog")
export class BlogController {
  constructor(
    private blogService: BlogService,
    private authService: AuthService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
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

  @Delete("id/:id")
  async delete(@Req() req: Request, @Param("id") id: string) {
    const { email } = await this.authService.authorizeUser(req);
    return await this.blogService.deleteBlog(email, id);
  }

  @Get()
  async getAll() {
    return await this.blogService.getAllBlogs();
  }

  @Get("id/:id")
  async getOne(@Param("id") id: string) {
    return await this.blogService.getOneBlog(id);
  }

  @Get("views/:id")
  async updateViews(@Param("id") id: string) {
    return await this.blogService.updateViews(id);
  }

  @UseGuards(AuthGuard)
  @Get("likes/:id")
  async updateLikes(@Req() req: Request, @Param("id") id: string) {
    const { email } = await this.authService.authorizeUser(req);
    return await this.blogService.updateLikes(email, id);
  }

  @UseGuards(AuthGuard)
  @Post("comments")
  async writeComment(@Req() req: Request, @Body() commentDto: CommentDto) {
    const { email } = await this.authService.authorizeUser(req);
    return await this.blogService.writeComment(email, commentDto);
  }

  @UseGuards(AuthGuard)
  @Delete("comments")
  async deleteComment(@Req() req: Request, @Body() commentDto: CommentDto) {
    const { email } = await this.authService.authorizeUser(req);
    return await this.blogService.deleteComment(email, commentDto);
  }
}
