import { Injectable, NotFoundException } from '@nestjs/common';
import { EventInterface } from '@interfaces/event.interface';
import { EventImplements } from '@data/repositories/implements/event.implments';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TelegramService } from './telegram.service';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventImplements,
    private readonly telegramService: TelegramService
  ) {}

  async findById(eventId: number) {
    return await this.eventRepository.findById(eventId);
  }

  async findByUser(userId: number) {
    return await this.eventRepository.findByUser(userId);
  }

  async createEvent(data: EventInterface) {
    return await this.eventRepository.createEvent(data);
  }

  async updateEvent(eventId: number, data: EventInterface) {
    return await this.eventRepository.updateEvent(eventId, data);
  }

  async deleteEvent(userId: number) {
    const user = await this.eventRepository.findById(userId);

    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return await this.eventRepository.deleteEvent(userId);
  }

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'sendNotification',
    timeZone: 'America/Sao_Paulo',
  })
  async handleCron() {
    console.log('Running notifications...');
    const start = Date.now();
    const events = await this.eventRepository.findTodayEvents();
    for (const event of events) {
      const { user, title } = event;
      console.log(title, user);
      // await this.telegramService.sendMessage(Number(user.idBot), title);
    }
    const timeTaken = Date.now() - start;
    console.log('Finished!');
    console.log('Execution time: ' + timeTaken + ' milliseconds');
  }
}
