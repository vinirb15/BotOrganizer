import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async createUser(data: UserEntity): Promise<UserEntity> {
    const existingUser = await await this.prisma.users.findFirst({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });

    if (existingUser) throw new BadRequestException('Usuário já cadastrado.');

    const user = await this.prisma.users.create({
      data: this.userMapper.toPrisma(data),
    });

    return this.userMapper.toDomain(user);
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
