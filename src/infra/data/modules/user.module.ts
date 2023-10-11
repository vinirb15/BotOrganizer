import { Global, Module } from '@nestjs/common';
import { UserService } from '@services/user.service';
import { UserController } from '@controllers/user/user.controller';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
