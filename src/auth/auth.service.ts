import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = 'nusa-secret-key';

  constructor(private readonly userService: UserService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{
    token: string;
    role: string;
  } | null> {
    const user = await this.userService.findByEmail(email);

    if (email === user.email && password === user.password) {
      const role = user.role;
      const token = jwt.sign(
        { id: user.id, username: user.username, email, role: user.role },
        this.JWT_SECRET,
        { expiresIn: '1h' },
      );
      return { token, role };
    }
    return null;
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (e) {
      return null;
    }
  }
}
