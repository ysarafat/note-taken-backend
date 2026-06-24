import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await argon2.hash(registerDto.password);
    const user = await this.userService.getUserByEmail(registerDto.email);

    if (user) {
      throw new ConflictException('Email already exists');
    }
    const newUser = await this.userService.createUser(
      registerDto.name,
      registerDto.email,
      hashedPassword,
    );
    const payload = { sub: newUser.id, email: newUser.email };
    const token = await this.jwtService.signAsync(payload);
    return { ...newUser, token };
  }
}
