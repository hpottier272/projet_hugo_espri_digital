import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'hello hugo';
  }

  getAuth(): string {
    return 'page authentification';
  }

  postAuth(): string {
    return 'page authentification avec methode post';
  }
}
