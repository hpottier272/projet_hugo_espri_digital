import { Body, Controller, Get, Param, Post, Delete, HttpCode, HttpStatus} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { Public } from 'src/auth/public.decorateur';
import { ResponseDto } from 'src/auth/dto/response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, getSchemaPath} from '@nestjs/swagger';
import { User } from './user.entity';

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Liste de tous les utilisateurs' })
    @ApiResponse({
      status: 200,
      description: 'Liste des utilisateurs retournée.',
      schema: {
        example: {
          statusCode: 200,
          message: 'Liste des utilisateurs retournée.',
          data: {
            users: [
              {
                id: 'a1b2c3d4',
                userName: 'jdoe',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                createdAt: '2025-06-11T12:34:56Z',
                updatedAt: '2025-06-11T12:34:56Z'
              },
              {
                id: 'e5f6g7h8',
                userName: 'asmith',
                firstName: 'Alice',
                lastName: 'Smith',
                email: 'alice.smith@example.com',
                createdAt: '2025-06-10T10:00:00Z',
                updatedAt: '2025-06-10T10:00:00Z'
              }
            ]
          }
        }
      }
    })
    @ApiResponse({ 
      status: 500,
      description: 'Erreur interne du serveur.',
      schema: {
        example: {
          statusCode: 500,
          message: 'Erreur interne du serveur.',
          data: null,
        }
      }
    })
    async getAll(): Promise<ResponseDto<{ users: User[] }>> {
      return this.userService.findAll();
    }


    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Trouver un utilisateur par ID' })
    @ApiParam({ name: 'id', description: 'ID de l’utilisateur', type: String })
    @ApiResponse({
        status: 200,
        description: 'Utilisateur trouvé.',
        schema: {
          example: {
            id: '123',
            userName: 'jdoe',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          }
        }
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Utilisateur non trouvé.' 
    })
    @ApiResponse({ 
        status: 500,
        description: 'Erreur interne du serveur.',
        schema: {
          example: {
            statusCode: 500,
            message: 'Erreur interne du serveur.',
            data: null,
          }
        }
    })
    async findOne(@Param('id') id: string): Promise<ResponseDto<User | null>> {
      return this.userService.findOneById(id);
    }

    @Public()
    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
    @ApiBody({ 
      type: CreateUserDto,
      examples: {
        default: {
          summary: 'Exemple de payload',
          value: {
            userName: 'jdoe',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'StrongP@ss123'
          }
        }
      }
    })
    @ApiResponse({ 
      status: 201,
      description: 'Utilisateur créé avec succès.',
      schema: {
        example: {
          statusCode: 201,
          message: 'Utilisateur créé avec succès.',
          data: null
        }
      }
    })
    @ApiResponse({ 
      status: 400,
      description: 'Erreur de validation ou données invalides.',
      schema: {
        example: {
          statusCode: 400,
          message: 'Email invalide ou mot de passe trop faible.',
          data: null
        }
      }
    })
    @ApiResponse({ 
      status: 500,
      description: 'Erreur interne du serveur.',
      schema: {
        example: {
          statusCode: 500,
          message: 'Erreur interne du serveur.',
          data: null
        }
      }
    })
    async create(@Body() createUserDto: CreateUserDto): Promise<ResponseDto<null>> {
      return this.userService.createUser(createUserDto);
    }


    @Delete()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Supprimer un utilisateur' })
    @ApiResponse({
        status: 200, 
        description: 'Utilisateur supprimé.' 
    })
    @ApiResponse({ 
        status: 404, description: 'Utilisateur non trouvé.' 
    })
    @ApiResponse({ 
        status: 500,
        description: 'Erreur interne du serveur.',
        schema: {
        example: {
            statusCode: 500,
            message: 'Erreur interne du serveur.',
            data: null,
        }
        }
    })
    async remove(@Body() id: string): Promise<ResponseDto<null>> {
      return this.userService.remove(id);
    }

    @Get('session')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Liste toutes les sessions de l\'utilisateur' })
    @ApiResponse({ 
        status: 200, 
        description: 'Liste des sessions retournée.',
        schema: {
          example: [
            {
              id: 'session123',
              userId: '123',
              accessTokenId: 'token123',
              refreshTokenId: 'refresh123',
              createdAt: '2025-06-10T12:00:00Z'
            }
          ]
        }
      })
    @ApiResponse({ 
      status: 500,
      description: 'Erreur interne du serveur.',
      schema: {
        example: {
          statusCode: 500,
          message: 'Erreur interne du serveur.',
          data: null,
        }
      }
    })
    async getAllSession(): Promise<ResponseDto<{ sessions: any[] }>> {
      return this.userService.findAllSession();
    }

   
}