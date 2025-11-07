/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/common/guards/auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types/auth/decode_jwt.interface';
import { IAuthData } from '../types/auth/auth_data.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader)
      throw new UnauthorizedException('Authorization header missing');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Token missing or malformed');

    try {
      const payload: JwtPayload = await this.jwtService.decode(token as string);

      const auth_user: IAuthData = {
        user_email: payload.user_email,
        user_id: payload.user_id,
        user_role: payload.user_role,
      };

      request.user = auth_user;
      return true;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
