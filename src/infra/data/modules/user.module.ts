import { Global, Module } from '@nestjs/common';
import { UserService } from '@services/user.service';
import { UserController } from '@controllers/user/user.controller';
import { LogedUserHandler } from '@handlers/loged-user.handler';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService, LogedUserHandler],
})
export class UserModule {}
