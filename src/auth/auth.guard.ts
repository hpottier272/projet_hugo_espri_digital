import { CanActivate,ExecutionContext,Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response} from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorateur';
import { UserService } from 'src/users/user.service';
  
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
      private readonly usersService: UserService,
      private jwtService: JwtService,
      private reflector: Reflector,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (isPublic) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const token = request.cookies?.jwt;
      if (!token) {
        response.status(401).json({ statusCode: 401, message: 'Authentification requise' });
        return false;
      }

      try {
        const payload = await this.jwtService.verifyAsync(token);
        if (!payload){
          response.status(401).json({ statusCode: 401, message: 'utilisateur inconnu' });
          return false;
        }
        const session = await this.usersService.findSessionByAccess(payload.sub,payload.jti)
        if (!session){
          response.status(401).json({ statusCode: 401, message: 'pas de session pour cet utilisateur avec ce token' });
          return false;
        }
        request['user'] = payload;
      } catch (error){
        response.status(401).json({ statusCode: 401, message: 'Token invalide ou expiré.' });
        return false;
      }
      return true;
    }
}