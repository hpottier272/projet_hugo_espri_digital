import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserSession } from './user-session.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User,UserSession])],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule,UserService]
})
export class UserModule {}
