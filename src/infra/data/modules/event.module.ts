import { Global, Module } from '@nestjs/common';
import { EventController } from 'src/presentation/controllers/event/event.controller';
import { EventService } from 'src/applications/services/event.service';

@Global()
@Module({
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
