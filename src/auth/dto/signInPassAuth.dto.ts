import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInPassAuthDto {
  @ApiProperty({
    example: 'johndoe',
    description: "Nom d'utilisateur",
  })
  @IsString()
  userName: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: "Mot de passe de l'utilisateur",
  })
  @IsString()
  password: string;
}
