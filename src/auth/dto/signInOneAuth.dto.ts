import { IsString } from 'class-validator';

export class SignInOneAuthDto {

  @IsString()
  userName: string;
  
  @IsString()
  password: string;
}
