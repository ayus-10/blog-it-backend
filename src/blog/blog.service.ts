import { Injectable } from "@nestjs/common";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UserToken } from "src/interfaces/user-token.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Blog } from "src/schemas/blog.schema";
import { CommentDto } from "./dto/comment.dto";

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
    let { likes } = blog;
    if (!likes.includes(email)) {
      likes.push(email);
    } else {
      likes = likes.filter((em) => em !== email);
    }
    return await this.blogModel.findByIdAndUpdate(id, { likes: likes });
  }

  async writeComment(userEmail: string, commentDto: CommentDto) {
    const { id, comment } = commentDto;
    const userComment = {
      userEmail,
      comment,
    };
    const blog = await this.blogModel.findById(id);
    blog.comments.push(userComment);
    return await this.blogModel.findByIdAndUpdate(id, blog);
  }

  async deleteComment(userEmail: string, commentDto: CommentDto) {
    const { id, comment } = commentDto;
    const blog = await this.blogModel.findById(id);
    const { comments } = blog;
    const updatedComments = comments.filter(
      (cmt) => !(cmt.comment === comment && cmt.userEmail === userEmail),
    );
    blog.comments = updatedComments;
    return await this.blogModel.findByIdAndUpdate(id, blog);
  }
}
