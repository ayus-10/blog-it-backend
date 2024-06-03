import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Blog {
  @Prop({ required: true })
  userEmail: string;
  @Prop({ required: false })
  imageFile: string;
  @Prop()
  title: string;
  @Prop()
  category: string;
  @Prop()
  content: string;
  @Prop()
  views: number;
  @Prop()
  likes: string[];
  @Prop()
  comments: string[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
