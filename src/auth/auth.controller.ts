
import { Body, Controller, Get, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInOneAuthDto } from './dto/signInOneAuth.dto';
import { SignInTwoAuthDto } from './dto/signInTwoAuth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  getAuth(): string {
    return this.authService.accueilauth();
  }

  @Post('loginOne')
  async signInOneAuth(@Body() signInOneAuthDto: SignInOneAuthDto): Promise<string> {
    const code = await this.authService.signInOneAuth(signInOneAuthDto.userName, signInOneAuthDto.password);
    return 'acces numero 1 autorise code : '+ code;
  }

  @Post('loginTwo')
  async signInTwoAuth(@Body() signInTwoAuthDto: SignInTwoAuthDto): Promise<string> {
    const token =  await this.authService.signInTwoAuth(signInTwoAuthDto.userName,signInTwoAuthDto.code );
    return 'acces numero 2 autorise token :'+ token;
  }

}
