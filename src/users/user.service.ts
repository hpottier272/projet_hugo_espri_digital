
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { UserSession } from './user-session.entity';
import { ResponseDto } from 'src/auth/dto/response.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) 
                private readonly usersRepository: Repository<User>,
              @InjectRepository(UserSession)
                private readonly sessionRepo: Repository<UserSession>,
              ) {}

  async findAll(): Promise<ResponseDto<{ users: User[] }>> {
    try {
      const users = await this.usersRepository.find();
      return {
        statusCode: 200,
        message: 'Liste des utilisateurs retournée.',
        data: { users },
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Erreur interne lors de la récupération des utilisateurs.',
      };
    }
  }

  async findOneById(id: string): Promise<ResponseDto<User | null>> {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        return {
          statusCode: 404,
          message: 'Utilisateur non trouvé.',
        };
      }
      return {
        statusCode: 200,
        message: 'Utilisateur trouvé.',
        data: user,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Erreur interne lors de la récupération de l\'utilisateur.',
      };
    }
  }

  async findOneByUsername(userName: string): Promise<ResponseDto<User | null>> {
    try {
      const user = await this.usersRepository.findOneBy({ userName });

      if (!user) {
        return {
          statusCode: 404,
          message: 'Utilisateur non trouvé avec ce nom d’utilisateur.',
        };
      }

      return {
        statusCode: 200,
        message: 'Utilisateur trouvé.',
        data: user,
      };
    } catch {
      return {
        statusCode: 500,
        message: 'Erreur serveur lors de la recherche de l’utilisateur par nom.',
      };
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<ResponseDto<null>> {
    try {
      const existing = await this.usersRepository.findOneBy({ userName: createUserDto.userName });
      if (existing) {
        return {
          statusCode: 409,
          message: 'Nom d’utilisateur déjà existant.',
        };
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      await this.usersRepository.save(user);
      return {
        statusCode: 201,
        message: `Utilisateur : ${createUserDto.firstName} ${createUserDto.lastName} créé avec succès.`,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Erreur interne lors de la création de l\'utilisateur.',
      };
    }
  }
 
  async remove(id: string): Promise<ResponseDto<null>> {
    try {
      const result = await this.usersRepository.delete(id);
      if (result.affected === 0) {
        return {
          statusCode: 404,
          message: 'Utilisateur non trouvé.',
        };
      }
      return {
        statusCode: 200,
        message: 'Utilisateur supprimé.',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Erreur interne lors de la suppression de l\'utilisateur.',
      };
    }
  }

  async save(user: User): Promise<ResponseDto<User>> {
    try {
      const savedUser = await this.usersRepository.save(user);
      return {
        statusCode: 200,
        message: 'Utilisateur sauvegardé.',
        data: savedUser,
      };
    } catch {
      return {
        statusCode: 500,
        message: 'Erreur serveur lors de la sauvegarde de l’utilisateur.',
      };
    }
  }

  async createSession(data: Partial<UserSession>): Promise<ResponseDto<null>> {
    try {
      const session = this.sessionRepo.create(data);
      await this.sessionRepo.save(session);
      return {
        statusCode: 201,
        message: 'Session créée avec succès.',
      };
    } catch {
      return {
        statusCode: 500,
        message: 'Erreur serveur lors de la création de la session.',
      };
    }
  }

  async findAllSession(): Promise<ResponseDto<{ sessions: UserSession[] }>> {
    try {
      const sessions = await this.sessionRepo.find();
      return {
        statusCode: 200,
        message: 'Liste des sessions retournée.',
        data: { sessions },
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Erreur interne lors de la récupération des sessions.',
      };
    }
  }

  async findSessionByAccess(userId: string, accessTokenId: string): Promise<ResponseDto<UserSession | null>> {
    try {
      const session = await this.sessionRepo.findOneBy({ userId, accessTokenId });

      if (!session) {
        return {
          statusCode: 404,
          message: 'Session non trouvée avec ce jeton d’accès.',
        };
      }

      return {
        statusCode: 200,
        message: 'Session trouvée.',
        data: session,
      };
    } catch {
      return {
        statusCode: 500,
        message: 'Erreur serveur lors de la recherche de la session par jeton d’accès.',
      };
    }
  }

  async findSessionByRefresh(userId: string, refreshTokenId: string): Promise<ResponseDto<UserSession | null>> {
    try {
      const session = await this.sessionRepo.findOneBy({ userId, refreshTokenId });

      if (!session) {
        return {
          statusCode: 404,
          message: 'Session non trouvée avec ce jeton de rafraîchissement.',
        };
      }

      return {
        statusCode: 200,
        message: 'Session trouvée.',
        data: session,
      };
    } catch {
      return {
        statusCode: 500,
        message: 'Erreur serveur lors de la recherche de la session par jeton de rafraîchissement.',
      };
    }
  }

  async deleteSession(userId: string, accessTokenId: string): Promise<ResponseDto<null>> {
    try {
      await this.sessionRepo.delete({ userId, accessTokenId });
      return {
        statusCode: 200,
        message: 'Session supprimée.',
      };
    } catch {
      return {
        statusCode: 500,
        message: 'Erreur serveur lors de la suppression de la session.',
      };
    }
  }
  
  async deleteAllSessions(userId: string): Promise<ResponseDto<null>> {
    try {
      await this.sessionRepo.delete({ userId });
      return {
        statusCode: 200,
        message: 'Toutes les sessions utilisateur supprimées.',
      };
    } catch {
      return {
        statusCode: 500,
        message: 'Erreur serveur lors de la suppression des sessions.',
      };
    }
  }
  
}