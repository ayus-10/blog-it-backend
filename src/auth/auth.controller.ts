import { Body, Controller, Post } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async authenticate(@Body() authDto: AuthDto) {
    return await this.authService.authenticateUser(authDto);
  }
}
