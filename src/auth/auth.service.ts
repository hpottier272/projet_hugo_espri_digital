
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  accueilauth(): string{
    return 'page d accueil de la page d authentification';
  }

  async signInPassAuth(userName: string, password: string): Promise<string> {
    const user = await this.searchUserByUserName(userName);
    if (!user || !await this.checkPassword(user,password)) {
      throw new UnauthorizedException('mot de passe ou identifiant invalide');
    }
    const code = await this.generateCode(user)
    await this.mailService.sendCode(user.mail, code);
    return 'votre code a etait envoye par mail';
  }

  async signInCodeAuth(userName: string, code: number): Promise<string> {
    const user = await this.searchUserByUserName(userName);
    if (!user ||!await this.checkCode(user,code)) {
      throw new UnauthorizedException('code invalide');
    }
    if (!(await this.generateToken(user))){
      throw new UnauthorizedException('une erreur est survenue, merci de réessayer ultérieurement');
    }
    return 'vous etes authentifie';
  }
  
  async searchUserByUserName(userName: string): Promise<User|null> {
    return this.usersService.findOneByuserName(userName);
  }

  async checkPassword(user: User, password: string): Promise<boolean> {
    if (!bcrypt.compare(password, user.password)) {
      return false;
    }
    return true;
  }

  async checkCode(user: User, code: number): Promise<boolean> {
    if (!bcrypt.compare(code.toString(), user.codeTempo)) {
      return false;
    }
    return true;
  }

  async generateCode(user : User) : Promise<number>{
    const code = Math.floor(100000 + Math.random() * 900000);
    user.codeTempo = await bcrypt.hash(code.toString(), 10);
    this.usersService.save(user);
    return code;
  }

  async generateToken(user : User) : Promise<boolean>{
    const token = await bcrypt.hash((await this.jwtService.signAsync({ sub: user.id })), 10); //payload
    if (!token){
      return false;
    }
    user.token = token;
    user.codeTempo = '';
    await this.usersService.save(user);
    return true;
  }
  
}
