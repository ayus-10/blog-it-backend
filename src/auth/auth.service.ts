import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { UserService } from "src/user/user.service";
import { BcryptUtil } from "src/utils/bcrypt.util";
import { JwtService } from "@nestjs/jwt";

interface AuthorizeHeaders extends Headers {
  authorization?: string;
}

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
        message: "No user registered with provided email",
      });
    }
    const { password: fetchedPassword } = fetchedUser;
    const isPasswordCorrect = await BcryptUtil.comparePassword(
      password,
      fetchedPassword,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException({
        message: "Provided password is incorrect",
      });
    }
    const token = await this.jwtService.signAsync({ email });
    return { email, token };
  }

  async authorizeUser(req: Request) {
    const reqHeaders: AuthorizeHeaders = req.headers;
    const tokenString = reqHeaders.authorization;
    const token = tokenString.split(" ")[1];
    let email: string;
    try {
      const tokenData = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      email = tokenData.email;
    } catch {}
    if (email) {
      return { email, token };
    }
    return null;
  }
}
