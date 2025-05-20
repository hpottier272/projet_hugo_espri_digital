
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

  async signInOneAuth(userName: string, password: string): Promise<string> {
    const user = await this.usersService.findOneByuserName(userName);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('mot de passe ou identifiant invalide');
    }
    user.codeTempo = Math.floor(100000 + Math.random() * 900000).toString(); 
    this.usersService.save(user);
    return user.codeTempo;
  }


  async signInTwoAuth(userName: string, code: string): Promise<string> {
    const user = await this.usersService.findOneByuserName(userName);
    if (code != user?.codeTempo) {
      throw new UnauthorizedException('code invalide');
    }
    const payload = { sub: user.id };
    user.token = await this.jwtService.signAsync(payload);
    this.usersService.save(user);
    return user.token;
  }


  /*

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

  */



}
