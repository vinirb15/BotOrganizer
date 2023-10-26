import { UserEntity } from '@data/domain/entities/user.entity';

export abstract class UserImplements {
  abstract findByBotId(userId: string): Promise<UserEntity>;
  abstract findById(userId: number): Promise<UserEntity>;
  abstract findByEmail(userEmail: string): Promise<UserEntity>;
  abstract login(email: string, password: string): Promise<UserEntity>;
  abstract createUser(body: UserEntity): Promise<UserEntity>;
  abstract isValidIdBot(idBot: string): Promise<boolean>;
  abstract deleteUser(userId: number): Promise<void>;
}
