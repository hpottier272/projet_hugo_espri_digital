import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('user/')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
        getall(): Promise<User[]> {
            return this.userService.findAll();
        }
    
    @Get(':id')
        findOne(@Param('id') id: number) {
            return this.userService.findOne(id);
        }

    @Post()
        async create(@Body() createUserDto: CreateUserDto):Promise<string> {
            return this.userService.createUser(createUserDto);
        }

}
