import { Global, Module } from '@nestjs/common';

import { PrismaService } from '@data/prisma/clients/prisma.service';
import { PrismaUserRepository } from '@data/repositories/user.repository';
import { UserImplements } from '@data/repositories/implements/user.implments';
import { PrismaUserMapper } from '@data/prisma/mappers/user.mapper';
import { EventImplements } from '../repositories/implements/event.implments';
import { PrismaEventRepository } from '../repositories/event.repository';
import { PrismaEventMapper } from '../prisma/mappers/event.mapper';

@Global()
@Module({
  providers: [
    PrismaService,
    PrismaUserMapper,
    PrismaEventMapper,
    {
      provide: UserImplements,
      useClass: PrismaUserRepository,
    },
    {
      provide: EventImplements,
      useClass: PrismaEventRepository,
    },
  ],
  exports: [UserImplements, EventImplements],
})
export class DataModule {}
