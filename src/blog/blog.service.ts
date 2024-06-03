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

    const createdBlog = new this.blogModel<Blog>({
      userEmail,
      imageFile,
      title,
      category,
      content,
      views: 0,
      likes: [],
      comments: [],
    });

    return createdBlog.save();
  }

  async getAllBlogs() {
    return this.blogModel.find().exec();
  }

  async getOneBlog(id: string) {
    return await this.blogModel.findById(id).exec();
  }

  async updateViews(id: string) {
    const blog = await this.blogModel.findById(id);
    const { views } = blog;
    return await this.blogModel.findByIdAndUpdate(id, { views: views + 1 });
  }

  async updateLikes(email: string, id: string) {
    const blog = await this.blogModel.findById(id);
    const { likes } = blog;
    if (!likes.includes(email)) {
      likes.push(email);
    } else {
      return;
    }
    return await this.blogModel.findByIdAndUpdate(id, { likes: likes });
  }
}
