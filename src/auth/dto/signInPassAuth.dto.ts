import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInPassAuthDto {

  @IsString()
  @ApiProperty({ example: 'johndoe', description: 'Nom d\'utilisateur' })
  userName: string;
  
  @IsString()
  @ApiProperty({ example: 'StrongPassword123!', description: 'Mot de passe de l\'utilisateur' })
  password: string;
}
