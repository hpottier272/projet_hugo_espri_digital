
import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { MailService } from 'src/mail/mail.service';
import { ResponseDto } from './dto/response.dto';
import { jwtConstants } from './constants';
import { TokensDto } from './dto/token.dto';

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
        return { 
          statusCode: 401, 
          message: 'Identifiant ou mot de passe invalide.' 
        };
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

  async signInCodeAuth(userName: string, code: number): Promise<ResponseDto<{ accessToken: string, refreshToken: string }>> {
    try {
      const user = await this.searchUserByUserName(userName);
      if (!user || !(await this.checkCode(user, code))) {
        return { statusCode: 401, message: 'Code invalide.' };
      }

      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(user);
      await this.saveSecureRefreshToken(user, refreshToken);
      await this.saveSecureAccessToken(user, accessToken);
      return {
        statusCode: 200,
        message: 'Connexion réussie',
        data: new TokensDto({ accessToken, refreshToken }),
      };
      
    }catch (error) {
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
    user.accessTokenId = '';
    user.accessToken = '';
    user.refreshToken = '';
    await this.usersService.save(user);
    return { statusCode: 200, message: 'Déconnexion réussie.' };
  }

  async refresh(token: TokensDto): Promise<ResponseDto<{ accessToken: string, refreshToken: string }>> {
    try {
      const payload = await this.jwtService.verifyAsync(token.refreshToken, { secret: jwtConstants.refreshSecret });
      const user = await this.usersService.findOneById(payload.sub);
      if (!user || !user.refreshToken) {
        return { statusCode: 403, message: 'Accès refusé.' };
      }
  
      const isMatch = await bcrypt.compare(token.refreshToken, user.refreshToken);
      if (!isMatch) {
        return { statusCode: 403, message: 'Token de rafraîchissement invalide.' };
      }
  
      const newAccessToken = await this.generateAccessToken(user);
      const newRefreshToken = await this.generateRefreshToken(user);
      await this.saveSecureAccessToken(user, newAccessToken);
      await this.saveSecureRefreshToken(user, newRefreshToken);
      return {
        statusCode: 200,
        message: 'Nouveau token généré.',
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken, },
      };
    } catch (e) {
      return { statusCode: 403, message: 'Token invalide ou expiré.' };
    }
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

  private async generateAccessToken(user: User): Promise<string> {
    const tokenId = crypto.randomUUID();
    const token = await this.jwtService.signAsync({ sub: user.id, jti: tokenId });
    user.accessTokenId = tokenId;
    await this.usersService.save(user);
    return token;
  }
  
  private async generateRefreshToken(user: User): Promise<string> {
    return this.jwtService.signAsync(
      { sub: user.id },
      { secret: jwtConstants.refreshSecret, expiresIn: '7d' }
    );
  }
  
  private async generateCode() : Promise<number>{
    const code = Math.floor(100000 + Math.random() * 900000);
    return code;
  }
  
  private async saveSecureRefreshToken(user: User, refreshToken: string): Promise<void> {
    const hashed = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashed;
    await this.usersService.save(user);
  }

  private async saveSecureCode(user: User, code: number): Promise<void> {
    user.codeTempo = await bcrypt.hash(code.toString(), 10);
    await this.usersService.save(user);
  }
  
  private async saveSecureAccessToken(user: User, token: string): Promise<void> {
    user.accessToken = await bcrypt.hash(token, 10);
    user.codeTempo = '';
    await this.usersService.save(user);
  }

}