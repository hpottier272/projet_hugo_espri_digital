import { Module } from '@nestjs/common';
import { AppController,AuthentificationController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController,AuthentificationController],
  providers: [AppService],
})
export class AppModule {}
