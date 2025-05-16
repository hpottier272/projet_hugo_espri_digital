import { Controller, Get, Post } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';

@Controller('auth/')
export class AuthentificationController {
  constructor(private readonly authentificationService: AuthentificationService) {}

  @Get()
  getAuth(): string {
    return this.authentificationService.getAuth();
  }

  @Post()
  postAuth(): string {
    return this.authentificationService.postAuth();
  }
}
