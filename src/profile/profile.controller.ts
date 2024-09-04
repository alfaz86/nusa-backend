import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const user = await this.authService.verifyToken(token);
      if (user) {
        return user;
      }
    }
    return { error: 'Unauthorized' };
  }
}
