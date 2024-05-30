import { Injectable } from "@nestjs/common";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UserToken } from "src/interfaces/user-token.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Blog } from "src/schemas/blog.schema";

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async createBlog(
    currentUser: UserToken,
    image: Express.Multer.File,
    createBlogDto: CreateBlogDto,
  ) {
    const userEmail = currentUser.email;
    const imageFile = image.filename;
    const { title, category, content } = createBlogDto;

    const createdBlog = new this.blogModel({
      userEmail,
      imageFile,
      title,
      category,
      content,
    });

    return createdBlog.save();
  }

  getAllBlogs() {
    return this.blogModel.find().exec();
  }
}
