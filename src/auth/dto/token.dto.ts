import { IsJWT, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...',
    description: 'Jeton d’accès (JWT)',
  })
  @IsJWT()
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...',
    description: 'Jeton de rafraîchissement (JWT)',
  })
  @IsJWT()
  refreshToken: string;

  @ApiProperty({
    example: 'device-1234',
    required: false,
    description: "Identifiant de l'appareil (optionnel)",
  })
  @IsOptional()
  @IsString()
  deviceId?: string;

  constructor(partial: Partial<TokensDto>) {
    Object.assign(this, partial);
  }
}
