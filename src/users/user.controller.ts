import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
    getall(): Promise<User[]> {
        return this.userService.findAll();
    }
}
