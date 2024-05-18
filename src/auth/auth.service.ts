import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { UserService } from "src/user/user.service";
import { BcryptUtil } from "src/utils/bcrypt.util";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async authenticateUser(authDto: AuthDto) {
    const { email, password } = authDto;
    const fetchedUser = await this.userService.getUser(email);
    if (!fetchedUser) {
      throw new UnauthorizedException({
        error: "No user registered with provided email",
      });
    }
    const { password: fetchedPassword } = fetchedUser;
    const isPasswordCorrect = await BcryptUtil.comparePassword(
      password,
      fetchedPassword,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException({
        error: "Provided password is incorrect",
      });
    }
    const payload = { email };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
