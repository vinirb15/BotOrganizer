import { UserImplements } from '@data/repositories/implements/user.implments';
import { UserInterface } from '@interfaces/user.interface';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserImplements) {}

  async findById(userId: number) {
    return await this.userRepository.findById(userId);
  }

  async createUser(data: UserInterface) {
    const user = await this.userRepository.findByPhoneNumber(data.phoneNumber);

    if (user) throw new BadRequestException('Já existe usuário com este número de telefone.');

    return await this.userRepository.createUser(data);
  }
}
