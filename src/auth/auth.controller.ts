import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { type User } from '../generated/prisma/client.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  @HttpCode(201)
  create(@Body() body: User) {
    const message = this.authService.register(body);
    return message;
  }

  @Post('signin')
  login(@Body() body: User) {
    const token = this.authService.login(body);
    return { token: token, message: `login SuccesFully` };
  }
}
