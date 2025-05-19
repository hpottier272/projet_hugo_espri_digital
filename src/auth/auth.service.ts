
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  accueilauth(): string{
    return 'page d accueil de la page d authentification';
  }

  async signIn(userName: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByuserName(userName);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('mot de passe ou identifiant invalide');
    }
    const payload = { sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
