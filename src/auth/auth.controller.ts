
import { Body, Controller, Get, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInPassAuthDto } from './dto/signInPassAuth.dto';
import { SignInCodeAuthDto } from './dto/signInCodeAuth.dto';
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
  @Post('loginPass')
  async signInPassAuth(@Body() signInPassAuthDto: SignInPassAuthDto): Promise<string> {
    const code = await this.authService.signInPassAuth(signInPassAuthDto.userName, signInPassAuthDto.password);
    return code;
  }

  @Public()
  @Post('loginCode')
  async signInCodeAuth(@Body() signInCodeAuthDto: SignInCodeAuthDto): Promise<string> {
    const token =  await this.authService.signInCodeAuth(signInCodeAuthDto.userName,signInCodeAuthDto.code );
    return token;
  }

}
