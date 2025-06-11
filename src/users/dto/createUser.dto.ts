import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({ example: 'John' })
  @IsString()  
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()  
  lastName: string;

  @ApiProperty({ example: 'jdoe' })
  @IsString()  
  userName: string;

  @ApiProperty({ example: 'P@ssw0rd123!', minLength: 12, maxLength : 64 })
  @IsString()
  @MinLength(12, { message: 'Le mot de passe doit contenir plus de 12 caractères.' })
  @MaxLength(64, { message: 'Le mot de passe doit contenir au maximum 64 caractères.' })
  password: string;

  @ApiProperty({ example: '0123456789' })
  @IsString()
  tel: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsString()
  mail: string;
}