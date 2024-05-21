import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async authenticate(@Body() authDto: AuthDto) {
    return await this.authService.authenticateUser(authDto);
  }

  @Get()
  async authorize(@Req() req: Request) {
    return await this.authService.authorizeUser(req);
  }
}
