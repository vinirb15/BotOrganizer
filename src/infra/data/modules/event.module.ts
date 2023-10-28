import { Global, Logger, Module } from '@nestjs/common';
import { EventController } from 'src/presentation/controllers/event/event.controller';
import { EventService } from '@services/event.service';
import { LogedUserHandler } from 'src/presentation/handlers/loged-user.handler';
import { UserService } from '@services/user.service';
import { TelegramService } from '@services/telegram.service';

@Global()
@Module({
  controllers: [EventController],
  providers: [EventService, UserService, LogedUserHandler, TelegramService, Logger],
})
export class EventModule {}
