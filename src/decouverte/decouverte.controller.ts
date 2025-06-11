import { Controller, Get, Post, Body, Param} from '@nestjs/common';
import { DecouverteService } from './decouverte.service';
import { CreateUserDecouverteDto } from './dto/createUserDecouverte.dto';

@Controller('decouverte/')
export class DecouverteController {
  constructor(private readonly decouverteService: DecouverteService) {}

  @Get()
  getAuth(): string {
    return this.decouverteService.getAuth();
  }

  @Get(':username')
  findOne(@Param('username') name: string) {
    return this.decouverteService.getuser(name);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDecouverteDto): Promise<string> {
    return this.decouverteService.postAuth(createUserDto);
  }


}
