import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserSession {
  @ApiProperty({ example: '123' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '123' })
  @Column()
  userId: string;

  @ApiProperty({ example: '5885285123' })
  @Column()
  accessTokenId: string;

  @ApiProperty({ example: 'fbfcnhfcncvn' })
  @Column()
  hashedAccessToken: string;

  @ApiProperty({ example: '123426542' })
  @Column()
  refreshTokenId: string;

  @ApiProperty({ example: 'dhftysgwxdkf' })
  @Column()
  hashedRefreshToken: string;

  @Column({ nullable: true })
  deviceId?: string;

  @Column({ nullable: true })
  ip?: string;

  @ApiProperty({ example: '2025-06-10T12:00:00Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
