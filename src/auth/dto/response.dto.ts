import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ResponseDto<T = null> {
  @ApiProperty({ example: 200, description: 'Code HTTP de la réponse' })
  statusCode: number;

  @ApiProperty({ example: "Opération réussie", description: "Message descriptif de l'opération" })
  @IsString()
  message: string;

  @ApiProperty({
    required: false,
    description: 'Résultat de la requête (optionnel)',
  })
  @IsOptional()
  data?: T;
}
