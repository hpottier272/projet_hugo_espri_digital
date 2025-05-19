import { Module } from '@nestjs/common';
import { DecouverteController } from './decouverte.controller';
import { DecouverteService } from './decouverte.service';

@Module({
  controllers: [DecouverteController],
  providers: [DecouverteService],
})
export class AuthentificationModule {}
