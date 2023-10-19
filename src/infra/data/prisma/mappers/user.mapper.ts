import { UserEntity } from '@data/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';

@Injectable()
export class PrismaUserMapper {
  toPrisma(data: UserEntity): Prisma.UsersCreateInput {
    return {
      idBot: data.idBot,
      phoneNumber: data.phoneNumber,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      accessToken: data.accessToken,
    };
  }

  toDomain(data: Users) {
    return new UserEntity({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      accessToken: data.accessToken,
    });
  }
}
