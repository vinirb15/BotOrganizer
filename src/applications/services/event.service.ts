import { Injectable, NotFoundException } from '@nestjs/common';
import { EventInterface } from '@interfaces/event.interface';
import { EventImplements } from '@data/repositories/implements/event.implments';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventImplements) {}

  async findById(eventId: number) {
    return await this.eventRepository.findById(eventId);
  }

  async findByUser(userId: number) {
    return await this.eventRepository.findByUser(userId);
  }

  async createEvent(data: EventInterface) {
    return await this.eventRepository.createEvent(data);
  }

  async updateEvent(data: EventInterface) {
    return await this.eventRepository.updateEvent(data);
  }

  async deleteEvent(userId: number) {
    const user = await this.eventRepository.findById(userId);

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return await this.eventRepository.deleteEvent(userId);
  }
}
