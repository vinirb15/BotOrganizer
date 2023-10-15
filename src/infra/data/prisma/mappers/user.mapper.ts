import { UserEntity } from '@data/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';

@Injectable()
export class PrismaUserMapper {
  toPrisma(data: UserEntity): Prisma.UsersCreateInput {
    return {
      phoneNumber: data.phoneNumber,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    };
  }

  toDomain(data: Users) {
    return new UserEntity({
      phoneNumber: data.phoneNumber,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  }
}
