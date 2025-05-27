import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  refreshTokenId: string;

  @Column()
  hashedRefreshToken: string;

  @Column({ nullable: true })
  deviceId?: string;

  @Column({ nullable: true })
  ip?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
