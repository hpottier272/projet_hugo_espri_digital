import { Body, Controller, Get, Post, HttpCode, HttpStatus,Res,Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInPassAuthDto } from './dto/signInPassAuth.dto';
import { SignInCodeAuthDto } from './dto/signInCodeAuth.dto';
import { Public } from './public.decorateur';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { ResponseDto } from './dto/response.dto';
import { Response, Request  } from 'express';

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
  @ApiBody({ type: SignInPassAuthDto })
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
  async signInPassAuth(@Body() dto: SignInPassAuthDto): Promise<ResponseDto<null>> {
    return this.authService.signInPassAuth(dto.userName, dto.password);
  }

  @Public()
  @Post('login/code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authentification avec code' })
  @ApiBody({ type: SignInCodeAuthDto })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
    schema: {
      example: {
        statusCode: 200,
        message: 'Connexion réussie',
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
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
  async signInCodeAuth(@Body() dto: SignInCodeAuthDto, @Res({ passthrough: true }) res: Response): Promise<ResponseDto<null>> {
    return this.authService.signInCodeAuth(dto.userName, dto.code, res);
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
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur lors de la déconnexion.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Erreur serveur lors de la déconnexion.',
      },
    },
  })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<ResponseDto<null>> {
    const accessToken = req.cookies?.jwt;
    const result = this.authService.logout(accessToken);
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
    });
    res.clearCookie('refresh', {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
    });
    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rafraîchir le token' })
  @ApiResponse({
    status: 200,
    description: 'Nouveaux tokens générés',
    schema: {
      example: {
        statusCode: 200,
        message: 'Nouveau token généré.',
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur interne lors du rafraîchissement du token.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Erreur interne lors du rafraîchissement du token.',
      },
    },
  })  
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<ResponseDto<{ accessToken: string, refreshToken: string }>> {
    const refreshToken = req.cookies?.refresh;
    const result = await this.authService.refresh(refreshToken);
      
    if (!result.data) {
      return result;
    }

    res.cookie('jwt', result.data.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh', result.data.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }


  @Public()
  @Post('clean')
  async clean(@Body() userid:string) : Promise<ResponseDto<null>>{
    return this.authService.clean(userid);
  }

}
