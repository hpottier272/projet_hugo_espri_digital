import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInPassAuthDto } from './dto/signInPassAuth.dto';
import { SignInCodeAuthDto } from './dto/signInCodeAuth.dto';
import { Public } from './public.decorateur';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from './dto/response.dto';
import { LogoutDto } from './dto/logout.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Message d\'accueil' })
  @ApiResponse({
    status: 200,
    description: 'Bienvenue sur l’interface d’authentification.',
    schema: {
      example: {
        statusCode: 200,
        message: 'Bienvenue sur l’interface d’authentification',
      },
    },
  })
  getAuth(): ResponseDto<null> {
    return { statusCode: HttpStatus.OK, message: this.authService.accueilauth() };
  }

  @Public()
  @Post('login/password')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Authentification par mot de passe' })
  @ApiResponse({
    status: 201,
    description: 'Code envoyé par mail.',
    schema: {
      example: {
        statusCode: 201,
        message: 'Un code a été envoyé à votre adresse e-mail.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Identifiant ou mot de passe invalide.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Identifiant ou mot de passe invalide.',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur interne : impossible de s\'authentifier',
    schema: {
      example: {
        statusCode: 500,
        message: 'Erreur interne : impossible de s\'authentifier',
      },
    },
  })
  async signInPassAuth(@Body() signInPassAuthDto: SignInPassAuthDto): Promise<ResponseDto<null>> {
    return this.authService.signInPassAuth(signInPassAuthDto.userName, signInPassAuthDto.password);
  }

  @Public()
  @Post('login/code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authentification avec code' })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
    schema: {
      example: {
        statusCode: 200,
        message: 'Connexion réussie',
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Code invalide.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Code invalide.',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur interne : impossible de vérifier le code.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Erreur interne : impossible de vérifier le code.',
      },
    },
  })
  async signInCodeAuth(@Body() signInCodeAuthDto: SignInCodeAuthDto): Promise<ResponseDto<{ accessToken: string, refreshToken: string }>> {
    return this.authService.signInCodeAuth(signInCodeAuthDto.userName, signInCodeAuthDto.code);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Déconnexion' })
  @ApiResponse({
    status: 200,
    description: 'Déconnexion réussie',
    schema: {
      example: {
        statusCode: 200,
        message: 'Déconnexion réussie.',
      },
    },
  })
  async logout(@Body() logoutdto : LogoutDto): Promise<ResponseDto<null>> {
    return this.authService.logout(logoutdto.userName);
  }


  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() { refreshToken }: { refreshToken: string }): Promise<ResponseDto<{ accessToken: string }>> {
    return this.authService.refresh(refreshToken);
  }

}