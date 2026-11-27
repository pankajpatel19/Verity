import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import bcrypt from 'bcryptjs';
import { User } from '../generated/prisma/client.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async register(data: User): Promise<User | string> {
    const { email, password } = data;
    const exist = await this.prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      throw new ConflictException('user Already exists');
    }
    const hashedPassWord = await bcrypt.hash(password, 12);

    await this.prisma.user.create({
      data: { name: data.name, email, password: hashedPassWord },
    });

    return `user registered succesfully`;
  }

  async login({ email, password }: User) {
    const exist = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!exist || !(await bcrypt.compare(password, exist.password))) {
      throw new UnauthorizedException('invalid email or password ');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: exist.id,
      email: exist.email,
    });
    return accessToken;
  }
}
