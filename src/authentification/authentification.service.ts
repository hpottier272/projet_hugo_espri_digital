import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class AuthentificationService {
  getAuth(): string {
    return 'page authentification avec GET';
  }
  
  getuser(name: string): string {
    return 'bonjour, ' + name + ' ravi de vous revoir ';
  }

  postAuth(createUserDto: CreateUserDto): string {
    return 'bonjour, ' + createUserDto.userName + ' '+ createUserDto.mdp;
  }
  
}
