
import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { MailService } from 'src/mail/mail.service';
import { ResponseDto } from './dto/response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  accueilauth(): string{
    return 'Bienvenue sur l’interface d’authentification';
  }

  async signInPassAuth(userName: string, password: string): Promise<ResponseDto<null>> {
    try {
      const user = await this.searchUserByUserName(userName);
      if (!user || !(await this.checkPassword(user, password))) {
        return { statusCode: 401, message: 'Identifiant ou mot de passe invalide.' };
      }
      const code = await this.generateCode();
      await this.saveSecureCode(user, code);
      await this.mailService.sendCode(user.mail, code);
      return {
        statusCode: 201,
        message: 'Un code a été envoyé à votre adresse e-mail.',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Erreur interne : impossible de s\'authentifier',
      };
    }
  }

  async signInCodeAuth(userName: string, code: number): Promise<ResponseDto<{ token: string }>> {
    try {
      const user = await this.searchUserByUserName(userName);
      if (!user || !(await this.checkCode(user, code))) {
        return { statusCode: 401, message: 'Code invalide.' };
      }
      const token = await this.generateToken(user);
      await this.saveSecureToken(user, token);
      return {
        statusCode: 200,
        message: 'Connexion réussie',
        data: { token },
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Erreur interne : impossible de vérifier le code.',
      };
    }
  }

  async logout(userName: string): Promise<ResponseDto<null>> {
    const user = await this.searchUserByUserName(userName);
    if (!user) {
      return { statusCode: 404, message: 'Utilisateur non trouvé.' };
    }
    user.token = '';
    await this.usersService.save(user);
    return { statusCode: 200, message: 'Déconnexion réussie.' };
  }
  
  private async searchUserByUserName(userName: string): Promise<User|null> {
    return this.usersService.findOneByuserName(userName);
  }

  private async checkPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  private async checkCode(user: User, code: number): Promise<boolean> {
    return bcrypt.compare(code.toString(), user.codeTempo);
  }

  private async generateCode() : Promise<number>{
    const code = Math.floor(100000 + Math.random() * 900000);
    return code;
  }

  private async saveSecureCode(user: User, code: number): Promise<void> {
    user.codeTempo = await bcrypt.hash(code.toString(), 10);
    await this.usersService.save(user);
  }

  private async generateToken(user: User): Promise<string> {
    return await this.jwtService.signAsync({ sub: user.id });
  }
  
  private async saveSecureToken(user: User, token: string): Promise<void> {
    user.token = await bcrypt.hash(token, 10);
    user.codeTempo = '';
    await this.usersService.save(user);
  }

}