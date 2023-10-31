import { Logger, Module } from '@nestjs/common';
import { GreeterUpdate } from '@handlers/greeter.handler';
import { RandomNumberScene } from '@scenes/random-number.scene';
import { CreateUserWizard } from '@wizards/create-user.wizard';
import { UserService } from '@services/user.service';
import { CreateEventWizard } from '@wizards/create-event.wizard';
import { EventService } from '@services/event.service';
import { TelegramService } from '@services/telegram.service';
import { UpdateEventWizard } from '@wizards/update-event.wizard';
import { LogedUserHandler } from 'src/presentation/handlers/loged-user.handler';
import { DeleteEventWizard } from 'src/applications/wizards/delete-event.wizard';
import { GetEventWizard } from 'src/applications/wizards/get-event.wizard';

@Module({
  providers: [
    GreeterUpdate,
    RandomNumberScene,
    CreateUserWizard,
    UserService,
    CreateEventWizard,
    EventService,
    TelegramService,
    UpdateEventWizard,
    LogedUserHandler,
    Logger,
    DeleteEventWizard,
    GetEventWizard,
  ],
})
export class HandlerModule {}
