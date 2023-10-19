import { UserImplements } from '@data/repositories/implements/user.implments';
import { UserInterface } from '@interfaces/user.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserImplements) {}

  async findById(userId: number) {
    return await this.userRepository.findById(userId);
  }

  async findByEmail(userEmail: string) {
    return await this.userRepository.findByEmail(userEmail);
  }

  async login(data: Partial<UserInterface>) {
    const { email, password } = data;
    const hash = await bcrypt.hash(password, process.env.ENCRYPT_SALT);
    return await this.userRepository.login(email, hash);
  }

  async createUser(data: UserInterface) {
    const { password } = data;
    const hash = await bcrypt.hash(password, process.env.ENCRYPT_SALT);
    return await this.userRepository.createUser({ ...data, password: hash });
  }

  async isValidIdBot(idBot: string) {
    return await this.userRepository.isValidIdBot(idBot);
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return await this.userRepository.deleteUser(userId);
  }
}
