import { Module } from "@nestjs/common";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";
import { AuthModule } from "src/auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "src/schemas/blog.schema";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "public", "uploads"),
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
