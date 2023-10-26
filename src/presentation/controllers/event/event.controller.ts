import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { EventService } from '@services/event.service';
import { EventDTO } from 'src/applications/DTOs/event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/findById')
  async findById(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.eventService.findById(eventId);
  }

  @Get('/findByUser')
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.eventService.findByUser(userId);
  }

  @Post()
  async createEvent(@Body() body: EventDTO) {
    return this.eventService.createEvent(body);
  }

  @Put()
  async updateEvent(@Body() body: EventDTO) {
    return this.eventService.updateEvent(body);
  }

  @Delete('/:eventId')
  async deleteEvent(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.eventService.deleteEvent(eventId);
  }
}
