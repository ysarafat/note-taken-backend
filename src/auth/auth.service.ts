import { ConflictException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";

import { UserService } from "../user/user.service";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await argon2.hash(registerDto.password);
    const user = await this.userService.getUserByEmail(registerDto.email);

    if (user) {
      throw new ConflictException("Email already exists");
    }
    const newUser = await this.userService.createUser(
      registerDto.name,
      registerDto.email,
      hashedPassword,
    );
    this.logger.log(`User registered: ${newUser.email}`);
    const payload = { sub: newUser.id, email: newUser.email };
    const token = await this.jwtService.signAsync(payload);
    return { ...newUser, token };
  }

  // login method can be implemented here in the future
  async login(email: string, password: string) {
    const isUserExist = await this.userService.getUserByEmail(email);
    if (!isUserExist) {
      throw new UnauthorizedException("Email or Incorrect password");
    }

    const isPasswordValid = await argon2.verify(isUserExist.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Email or Incorrect password");
    }

    const payload = { sub: isUserExist.id, email: isUserExist.email };
    const token = await this.jwtService.signAsync(payload);
    return {
      id: isUserExist.id,
      name: isUserExist.name,
      email: isUserExist.name,
      token,
    };
  }
}
