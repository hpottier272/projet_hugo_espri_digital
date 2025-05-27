import { CanActivate,ExecutionContext,Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response} from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorateur';
import { jwtConstants } from './constants';
import { UserService } from 'src/users/user.service';
import * as bcrypt from 'bcrypt';
  
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
      const token = this.extractTokenFromHeader(request);
      const response = context.switchToHttp().getResponse<Response>();
      
      if (!token) {
        response.status(401).json({ statusCode: 401, message: 'Authentification requise.' });
        return false;
      }

      try {
        const payload = await this.jwtService.verifyAsync(token, {secret: jwtConstants.secret });
        const user = await this.usersService.findOneById(payload.sub);
        if (!user){
          response.status(401).json({ statusCode: 401, message: 'utilisateur inconnu' });
          return false;
        }

        if (payload.jti !== user.accessTokenId) {
          response.status(401).json({ statusCode: 401, message: 'Token invalide (session révoquée).' });
          return false;
        }
        request['user'] = payload;
      } catch (error){
        response.status(401).json({ statusCode: 401, message: 'Token invalide ou expiré.' });
        return false;
      }
      return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }