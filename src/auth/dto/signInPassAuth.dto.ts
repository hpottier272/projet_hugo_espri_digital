import { IsString } from 'class-validator';

export class SignInPassAuthDto {

  @IsString()
  userName: string;
  
  @IsString()
  password: string;
}
