import { Injectable } from '@nestjs/common';
import { UserImplements } from './implements/user.implments';
import { PrismaService } from '@data/prisma/clients/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserImplements {
  constructor(private prismaRepository: PrismaService) {}
  findById(idUser: number): Promise<any> {
    throw new Error(`${idUser}Method not implemented.`);
  }
}
