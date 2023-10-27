import { Module } from '@nestjs/common';
import { GreeterUpdate } from '@handlers/greeter.handler';
import { RandomNumberScene } from '@scenes/random-number.scene';
import { GreeterWizard } from '@wizards/greeter.wizard';
import { CreateUserWizard } from '@wizards/create-user.wizard';
import { UserService } from '@services/user.service';
import { CreateEventWizard } from '@wizards/create-event.wizard';
import { EventService } from '@services/event.service';
import { TelegramService } from '@services/telegram.service';

@Module({
  providers: [
    GreeterUpdate,
    RandomNumberScene,
    GreeterWizard,
    CreateUserWizard,
    UserService,
    CreateEventWizard,
    EventService,
    TelegramService,
  ],
})
export class GreeterModule {}
