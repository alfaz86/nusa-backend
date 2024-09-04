import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authToken = request.headers.authorization?.split(' ')[1];

    if (authToken) {
      const user = await this.authService.verifyToken(authToken);
      return !!user;
    }
    return false;
  }
}
