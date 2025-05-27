
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;
  
  @Column()
  lastName: string;

  @Column()
  userName: string;
  
  @Column()
  password: string;

  @Column()
  tel: string;
  
  @Column({default: null})
  codeTempo:string;

  @Column({default:null})
  accessTokenId: string;

  @Column({default: null})
  accessToken: string;

  @Column({default: null})
  refreshToken: string;

  @Column()
  mail: string;
}
