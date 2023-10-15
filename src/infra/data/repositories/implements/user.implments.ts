import { UserEntity } from '@data/domain/entities/user.entity';

export abstract class UserImplements {
  abstract findById(userId: number): Promise<UserEntity>;
  abstract findByPhoneNumber(phoneNumber: string): Promise<UserEntity>;
  abstract createUser(body: UserEntity): Promise<UserEntity>;
}
