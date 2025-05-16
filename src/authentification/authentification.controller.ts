import { Controller, Get, Post, Body, Param} from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('auth/')
export class AuthentificationController {
  constructor(private readonly authentificationService: AuthentificationService) {}

  @Get()
  getAuth(): string {
    return this.authentificationService.getAuth();
  }

  @Get(':username')
  findOne(@Param('username') name: string) {
    return this.authentificationService.getuser(name);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.authentificationService.postAuth(createUserDto);
  }


}
