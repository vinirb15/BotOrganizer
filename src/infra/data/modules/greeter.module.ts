import { Module } from '@nestjs/common';
import { GreeterUpdate } from '@handlers/greeter.handler';
import { RandomNumberScene } from '@scenes/random-number.scene';
import { GreeterWizard } from '@wizards/greeter.wizard';
import { CreateUserWizard } from '@wizards/create-user.wizard';
import { UserService } from 'src/applications/services/user.service';
import { CreateEventWizard } from 'src/applications/wizards/create-event.wizard';
import { EventService } from 'src/applications/services/event.service';

@Module({
  providers: [
    GreeterUpdate,
    RandomNumberScene,
    GreeterWizard,
    CreateUserWizard,
    UserService,
    CreateEventWizard,
    EventService,
  ],
})
export class GreeterModule {}
