import { Injectable } from "@nestjs/common";
import { CreateBlogDto } from "./dto/create-blog.dto";

@Injectable()
export class BlogService {
  createBlog(image: Express.Multer.File, createBlogDto: CreateBlogDto) {
    return { image, createBlogDto };
  }
}
