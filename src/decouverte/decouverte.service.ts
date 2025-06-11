import { Injectable } from '@nestjs/common';
import { CreateUserDecouverteDto } from './dto/createUserDecouverte.dto';

@Injectable()
export class DecouverteService {
  getAuth(): string {
    return 'page decouverte avec GET';
  }
  
  getuser(name: string): string {
    return 'bonjour, ' + name + ' ravi de vous revoir ';
  }

  postAuth(createUserDto: CreateUserDecouverteDto): string {
    return 'bonjour, ' + createUserDto.userName + ' '+ createUserDto.password;
  }
  
}
