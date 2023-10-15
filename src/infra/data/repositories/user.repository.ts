import { Injectable, NotFoundException } from '@nestjs/common';
import { UserImplements } from './implements/user.implments';
import { PrismaService } from '@data/prisma/clients/prisma.service';
import { UserEntity } from '@data/domain/entities/user.entity';
import { PrismaUserMapper } from '@data/prisma/mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements UserImplements {
  constructor(
    private prisma: PrismaService,
    private userMapper: PrismaUserMapper
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

  async findByPhoneNumber(phoneNumber: string): Promise<UserEntity> {
    const user = await this.prisma.users.findFirst({
      where: {
        phoneNumber,
      },
    });

    return this.userMapper.toDomain(user);
  }

  async createUser(data: UserEntity): Promise<UserEntity> {
    const user = await this.prisma.users.create({
      data: this.userMapper.toPrisma(data),
    });

    return this.userMapper.toDomain(user);
  }
}
