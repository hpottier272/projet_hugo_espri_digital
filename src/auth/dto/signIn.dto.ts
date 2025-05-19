import { IsString } from 'class-validator';

export class SignInDto {

  @IsString()
  userName: string;
  @IsString()
  password: string;
}
