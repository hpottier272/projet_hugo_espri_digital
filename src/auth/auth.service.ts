
import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { MailService } from 'src/mail/mail.service';
import { ResponseDto } from './dto/response.dto';
import { jwtConstants } from './constants';
import { TokensDto } from './dto/token.dto';
import { Response } from 'express';

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

  async clean(userId: string) {
    await this.usersService.deleteAllSessions(userId);
    return { statusCode: 200, message: 'session(s) supprimée(s)' };
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

  async signInCodeAuth(userName: string, code: number, res: Response): Promise<ResponseDto<null>> {
    try {
      const user = await this.searchUserByUserName(userName);
      if (!user || !(await this.checkCode(user, code))) {
        return { statusCode: 401, message: 'Code invalide.' };
      }

      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(user);
      await this.saveSecureRefreshToken(user, refreshToken);
      await this.saveSecureAccessToken(user, accessToken);
      await this.generateSession(user,accessToken,refreshToken);

      res.cookie('jwt', accessToken, {
        httpOnly: true, // permet d'éviter les attaques par XSS
        secure: false, // en prod : mettre true pour autoriser qu'en https
        sameSite: 'strict', // permet la transmission du cookies que sur le même site
        maxAge: 15 * 60 * 1000, // temps égal ou moins que celui du token (ici 15 min comme le AccessToken)
      });
      res.cookie('refresh', refreshToken, {
        httpOnly: true, // permet d'éviter les attaques par XSS
        secure: false, // en prod : mettre true pour autoriser qu'en https
        sameSite: 'strict', // permet la transmission du cookies que sur le même site
        maxAge: 7 * 24 * 60 * 60 * 1000, // temps égal ou moins que celui du token (ici 7 jours comme le RefreshToken)
      });
      
      return {
        statusCode: 200,
        message: 'Connexion réussie',
      };
      
    }catch (error) {
      console.error('Erreur dans signInCodeAuth:', error);
      return {
        statusCode: 500,
        message: 'Erreur interne : impossible de vérifier le code.',
      };
    }
  }

  async logout(refreshToken: string): Promise<ResponseDto<null>> {
    if (!refreshToken || typeof refreshToken !== 'string') {
      return { statusCode: 400, message: 'Refresh token manquant ou invalide.' };
    }
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch (error) {
      return { statusCode: 400, message: 'Token de déconnexion invalide.' };
    }
  
    const refreshTokenId = payload.jti;
    const userId = payload.sub;
  
    if (!userId) {
      return { statusCode: 404, message: 'Utilisateur non trouvé.' };
    }
  
    const session = await this.usersService.findSession(userId, refreshTokenId);
    if (!session) {
      return { statusCode: 404, message: 'Session introuvable.' };
    }
  
    await this.usersService.deleteSession(userId, refreshTokenId);
  
    return { statusCode: 200, message: 'Déconnexion réussie.' };
  }
  
  async refresh(token: TokensDto, ip?: string, deviceId?: string): Promise<ResponseDto<{ accessToken: string, refreshToken: string }>> {
    try {
      const payload = await this.jwtService.verifyAsync(token.refreshToken, { secret: jwtConstants.refreshSecret });
      const refreshTokenId = payload.jti;
      const userId = payload.sub;
      const session = await this.usersService.findSession(userId, refreshTokenId);
      if (!session) {
        return { statusCode: 403, message: 'Session introuvable.' };
      }

      const user = await this.usersService.findOneById(userId);
      if (!user || !session.AccessTokenId) {
        return { statusCode: 403, message: 'Accès refusé.' };
      }
  
      const isMatch = await bcrypt.compare(token.refreshToken,  session.hashedRefreshToken);
      if (!isMatch) {
        return { statusCode: 403, message: 'Token de rafraîchissement invalide.' };
      }
  
      const newAccessToken = await this.generateAccessToken(user);
      const newRefreshToken = await this.generateRefreshToken(user);
      await this.saveSecureAccessToken(user, newAccessToken);
      await this.saveSecureRefreshToken(user, newRefreshToken);
      await this.generateSession(userId,newAccessToken,newRefreshToken);
      await this.usersService.deleteSession(userId,session.refreshTokenId);
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
    const refreshTokenId = crypto.randomUUID();
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, jti: refreshTokenId },
      { expiresIn: '7d' },
    );
    user.refreshTokenId = refreshTokenId;
    await this.usersService.save(user);
    return refreshToken;
  }

  private async generateSession(user : User, accessToken : string, refreshToken : string, deviceId?: string, ip?: string) {
    const hashedAccessToken = await bcrypt.hash(accessToken, 10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.createSession({
      userId: user.id,
      AccessTokenId : user.accessTokenId,
      hashedAccessToken : hashedAccessToken,
      refreshTokenId : user.refreshTokenId,
      hashedRefreshToken: hashedRefreshToken,
      deviceId,
      ip,
    });
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
