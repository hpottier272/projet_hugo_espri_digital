import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInCodeAuthDto {

  @IsString()
  @ApiProperty({ example: 'johndoe', description: 'Nom d\'utilisateur' })
  userName: string;
  
  @IsNumber()
  @ApiProperty({ example: 123456, description: 'Code à 6 chiffres envoyé par email' })

  code: number;
}
