import { Module } from '@nestjs/common';
import { AppController} from './app.controller';
import { AppService } from './app.service';
import { AuthentificationModule } from './authentification/authentification.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserModule } from './users/user.module';
import { User } from './users/user.entity';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
