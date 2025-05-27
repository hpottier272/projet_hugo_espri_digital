import { IsJWT } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' })
  @IsJWT()
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' })
  @IsJWT()
  refreshToken: string;

  @ApiProperty({ required: false })
  deviceId?: string;

  constructor(partial: Partial<TokensDto>) {
    Object.assign(this, partial);
  }
}
