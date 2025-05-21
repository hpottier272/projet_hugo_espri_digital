
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
    const saltOrRounds = 10;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.codeTempo = await bcrypt.hash(code, saltOrRounds); 
    this.usersService.save(user);
    return code;
  }


  async signInTwoAuth(userName: string, code: string): Promise<string> {
    const user = await this.usersService.findOneByuserName(userName);
    if (!user || !await bcrypt.compare(code,user.codeTempo)) {
      throw new UnauthorizedException('code invalide');
    }
    const saltOrRounds = 10;
    const payload = { sub: user.id };
    user.token = await bcrypt.hash((await this.jwtService.signAsync(payload)), saltOrRounds);
    this.usersService.save(user);
    return user.token;
  }

  
}
