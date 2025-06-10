
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { UserSession } from './user-session.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) 
                private usersRepository: Repository<User>,
              @InjectRepository(UserSession)
                private sessionRepo: Repository<UserSession>,
              ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findOneByuserName(userName: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ userName });
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
  
  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async createUser(createUserDto : CreateUserDto): Promise<string> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.usersRepository.save(user);
    return 'utilisateur : ' + createUserDto.firstName + ' ' + createUserDto.lastName + ' cree avec succes';
  }

  async createSession(data: Partial<UserSession>): Promise<void> {
    const session = this.sessionRepo.create(data);
    await this.sessionRepo.save(session);
  }

  async findAllSession(): Promise<UserSession[]> {
    return this.sessionRepo.find();
  }

  async findSessionByAccess(userId: string, accessTokenId: string): Promise<UserSession | null> {
    return this.sessionRepo.findOneBy({ userId, accessTokenId });
  }

  async findSessionByRefresh(userId: string, refreshTokenId: string): Promise<UserSession | null> {
    return this.sessionRepo.findOneBy({ userId, refreshTokenId });
  }

  async deleteSession(userId: string, accessTokenId: string): Promise<void> {
    await this.sessionRepo.delete({ userId, accessTokenId });
  }
  
  async deleteAllSessions(userId: string): Promise<void> {
    await this.sessionRepo.delete({userId});
  }
  
}