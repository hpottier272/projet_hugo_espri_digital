
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) 
                private usersRepository: Repository<User>
            ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async createUser(createUserDto : CreateUserDto): Promise<string> {
    const user = this.usersRepository.create(createUserDto);
    this.usersRepository.save(user);
    return 'utilisateur : ' + createUserDto.firstName + createUserDto.lastName + ' cree avec succes';
  }

}
