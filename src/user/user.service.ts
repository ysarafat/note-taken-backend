import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  // createUser method to handle user creation
  async createUser(name: string, email: string, password: string) {
    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    return user;
  }

  // getUserByEmail method to retrieve user by email
  async getUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    return user;
  }
}
