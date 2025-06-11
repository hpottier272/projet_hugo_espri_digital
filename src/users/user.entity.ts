
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {

  @ApiProperty({ example: '123' })
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty({ example: 'John' })
  @Column()
  firstName: string;
  
  @ApiProperty({ example: 'Doe' })
  @Column()
  lastName: string;

  @ApiProperty({ example: 'jdoe' })
  @Column()
  userName: string;
  
  @ApiProperty({ example: 'P@ssw0rd123!', minLength: 12, maxLength : 64 })
  @Column()
  password: string;

  @ApiProperty({ example: '0123456789' })
  @Column()
  tel: string;
  
  @ApiProperty({ example: '012345' })
  @Column({default: null})
  codeTempo:string;
  
  @ApiProperty({ example: 'john.doe@example.com' })
  @Column()
  mail: string;
}
