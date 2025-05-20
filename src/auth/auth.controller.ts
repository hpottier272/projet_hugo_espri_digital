
import { Body, Controller, Get, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInOneAuthDto } from './dto/signInOneAuth.dto';
import { SignInTwoAuthDto } from './dto/signInTwoAuth.dto';
import { Public } from './public.decorateur';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get()
  getAuth(): string {
    return this.authService.accueilauth();
  }

  @Public()
  @Post('loginOne')
  async signInOneAuth(@Body() signInOneAuthDto: SignInOneAuthDto): Promise<string> {
    const code = await this.authService.signInOneAuth(signInOneAuthDto.userName, signInOneAuthDto.password);
    return 'votre code reçu code : '+ code;
  }

  @Public()
  @Post('loginTwo')
  async signInTwoAuth(@Body() signInTwoAuthDto: SignInTwoAuthDto): Promise<string> {
    const token =  await this.authService.signInTwoAuth(signInTwoAuthDto.userName,signInTwoAuthDto.code );
    return 'vous êtes authentifié, voici votre token :'+ token;
  }

}
