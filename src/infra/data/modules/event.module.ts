import { Global, Module } from '@nestjs/common';
import { EventController } from 'src/presentation/controllers/event/event.controller';
import { EventService } from 'src/applications/services/event.service';
import { LogedUserHandler } from 'src/presentation/handlers/loged-user.handler';
import { UserService } from 'src/applications/services/user.service';

@Global()
@Module({
  controllers: [EventController],
  providers: [EventService, UserService, LogedUserHandler],
})
export class EventModule {}
