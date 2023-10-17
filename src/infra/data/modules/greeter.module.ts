import { Module } from '@nestjs/common';
import { GreeterUpdate } from '@handlers/greeter.handler';
import { RandomNumberScene } from '@scenes/random-number.scene';
import { GreeterWizard } from '@wizards/greeter.wizard';
import { CreateUserWizard } from '@wizards/create-user.wizard';
import { UserService } from 'src/applications/services/user.service';

@Module({
  providers: [GreeterUpdate, RandomNumberScene, GreeterWizard, CreateUserWizard, UserService],
})
export class GreeterModule {}
