import { IsString } from 'class-validator';

export class SignInTwoAuthDto {

  @IsString()
  userName: string;
  
  @IsString()
  code: string;
}
