import { UserImplements } from '@data/repositories/implements/user.implments';
import { UserInterface } from '@interfaces/user.interface';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserImplements) {}

  async findById(userId: number) {
    return await this.userRepository.findById(userId);
  }

  async findByEmail(userEmail: string) {
    return await this.userRepository.findByEmail(userEmail);
  }

  async createUser(data: UserInterface) {
    return await this.userRepository.createUser(data);
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return await this.userRepository.deleteUser(userId);
  }
}
