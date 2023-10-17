import { UserEntity } from '@data/domain/entities/user.entity';

export abstract class UserImplements {
  abstract findById(userId: number): Promise<UserEntity>;
  abstract findByEmail(userEmail: string): Promise<UserEntity>;
  abstract createUser(body: UserEntity): Promise<UserEntity>;
  abstract deleteUser(userId: number): Promise<void>;
}
