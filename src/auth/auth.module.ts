
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { MailModule } from 'src/mail/mail.module';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    UserModule,
    MailModule,
    JwtModule.register({
      global: true,
      privateKey: fs.readFileSync(path.join(__dirname, '../../src/keys/private.key')),
      publicKey: fs.readFileSync(path.join(__dirname, '../../src/keys/public.key')),
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '15m',
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
