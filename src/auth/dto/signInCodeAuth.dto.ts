import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInCodeAuthDto {
  @ApiProperty({
    example: 'johndoe',
    description: "Nom d'utilisateur",
  })
  @IsString()
  userName: string;

  @ApiProperty({
    example: 123456,
    description: 'Code à 6 chiffres envoyé par email',
  })
  @IsNumber()
  code: number;
}
