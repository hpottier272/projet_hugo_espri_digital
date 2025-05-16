import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthentificationService {
  getAuth(): string {
    return 'page authentification avec GET';
  }

  postAuth(): string {
    return 'page authentification avec POST';
  }
}
