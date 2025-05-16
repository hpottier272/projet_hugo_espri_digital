import { Module } from '@nestjs/common';
import { AppController} from './app.controller';
import { AppService } from './app.service';
import { AuthentificationController } from './authentification/authentification.controller';
import { AuthentificationService } from './authentification/authentification.service';

@Module({
  imports: [],
  controllers: [AppController,AuthentificationController],
  providers: [AppService,AuthentificationService],
})
export class AppModule {}
