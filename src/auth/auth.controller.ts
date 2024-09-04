import { Controller, Post, Body, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const validateUser = await this.authService.validateUser(email, password);
    if (validateUser) {
      return validateUser;
    } else {
      return { error: 'Invalid credentials' };
    }
  }

  @Delete('logout')
  async logout(@Req() req: Request) {
    // Implementasikan logika logout jika ada (misalnya, hapus token dari storage)
    return { message: 'Logout successful' };
  }
}
