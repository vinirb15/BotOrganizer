import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserImplements } from './implements/user.implments';
import { PrismaService } from '@data/prisma/clients/prisma.service';
import { UserEntity } from '@data/domain/entities/user.entity';
import { PrismaUserMapper } from '@data/prisma/mappers/user.mapper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PrismaUserRepository implements UserImplements {
  constructor(
    private prisma: PrismaService,
    private userMapper: PrismaUserMapper,
    private jwtService: JwtService
  ) {}
  async findById(userId: number): Promise<UserEntity> {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return this.userMapper.toDomain(user);
  }

  async findByEmail(userEmail: string): Promise<UserEntity> {
    const user = await this.prisma.users.findFirst({
      where: {
        email: userEmail,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return this.userMapper.toDomain(user);
  }

  async login(email: string, password: string): Promise<UserEntity> {
    const user = await this.prisma.users.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      if (password === user.password) {
        const accessToken = await this.jwtService.signAsync({ ...user, password: null });
        await this.prisma.users.update({
          where: {
            id: user.id,
          },
          data: {
            accessToken,
          },
        });
        return this.userMapper.toDomain({
          ...user,
          accessToken,
          password: undefined,
        });
      }
    }

    throw new UnauthorizedException('Usuário ou senha inválido.');
  }

  async createUser(data: UserEntity): Promise<UserEntity> {
    const existingUser = await await this.prisma.users.findFirst({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });

    if (existingUser) throw new BadRequestException('Usuário já cadastrado.');
    const accessToken = await this.jwtService.signAsync({ ...data, password: null });

    const user = await this.prisma.users.create({
      data: this.userMapper.toPrisma({ ...data, accessToken }),
    });

    return this.userMapper.toDomain(user);
  }

  async isValidIdBot(idBot: string): Promise<boolean> {
    try {
      const user = await this.prisma.users.findFirst({
        where: {
          idBot,
        },
      });

      if (user) {
        await this.jwtService.verifyAsync(user.accessToken, {
          secret: process.env.JWT_SECRET,
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async deleteUser(userId: number): Promise<void> {
    await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        inactive: true,
      },
    });
  }
}
