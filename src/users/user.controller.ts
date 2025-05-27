import { Body, Controller, Get, Param, Post,Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UserSession } from './user-session.entity';

@Controller('user/')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
        getall(): Promise<User[]> {
            return this.userService.findAll();
        }

    @Get('session')
        getallsession(): Promise<UserSession[]> {
            return this.userService.findAllSession();
        }
    
    @Get(':id')
        findOne(@Param('id') id: string) {
            return this.userService.findOneById(id);
        }

    @Post()
        async create(@Body() createUserDto: CreateUserDto):Promise<string> {
            return this.userService.createUser(createUserDto);
        }

    @Delete()
        async remove(@Body() id: string) {
            return this.userService.remove(id);
        }

}
