import { Module } from '@nestjs/common';
import { AuthentificationModule } from './decouverte/decouverte.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserModule } from './users/user.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    AuthentificationModule, 
    UserModule,
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'test',
        entities: [User],
        synchronize: true, 
        retryAttempts : 3,
        retryDelay : 3000,
        autoLoadEntities: true,
    }),
    AuthModule, 
  ],
  providers: [{provide: APP_GUARD,useClass: AuthGuard}],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
