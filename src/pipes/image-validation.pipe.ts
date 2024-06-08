import {
  Injectable,
  NotAcceptableException,
  PipeTransform,
} from "@nestjs/common";

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  transform(image: Express.Multer.File) {
    if (!image) {
      throw new NotAcceptableException({
        error: "Please provide a valid image",
      });
    }

    const validMimeTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/jfif",
      "image/bmp",
      "image/webp",
      "image/gif",
      "image/avif",
    ];

    if (!validMimeTypes.includes(image.mimetype)) {
      throw new NotAcceptableException({
        error: "Only PNG, JPG, WEBP and JIF images are allowed",
      });
    }

    if (image.size > 1024 * 1024) {
      throw new NotAcceptableException({
        error: "Image size must be smaller than 1MB",
      });
    }

    return image;
  }
}
