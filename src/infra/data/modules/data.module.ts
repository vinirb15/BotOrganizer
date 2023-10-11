import { Global, Module } from '@nestjs/common';

import { PrismaService } from '@data/prisma/clients/prisma.service';
import { PrismaUserRepository } from '@data/repositories/user.repository';
import { UserImplements } from '@data/repositories/implements/user.implments';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: UserImplements,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserImplements],
})
export class DataModule {}
