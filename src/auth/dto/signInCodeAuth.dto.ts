import { IsString } from 'class-validator';

export class SignInCodeAuthDto {

  @IsString()
  userName: string;
  
  @IsString()
  code: number;
}
