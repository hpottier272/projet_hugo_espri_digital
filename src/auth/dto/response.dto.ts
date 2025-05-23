import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T = null> {
  @ApiProperty({ example: 200, description: 'Code HTTP de la réponse' })
  statusCode: number;

  @ApiProperty({ example: 'Message descriptif de l\'opération.' })
  message: string;

  @ApiProperty({ required: false, description: 'Résultat de la requête (optionnel)' })
  data?: T;
}

  