import { UserImplements } from '@data/repositories/implements/user.implments';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserImplements) {}

  async findById() {
    return this.userRepository.findById(1);
  }
}
