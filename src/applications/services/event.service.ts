import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventInterface } from '@interfaces/event.interface';
import { EventImplements } from '@data/repositories/implements/event.implments';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TelegramService } from './telegram.service';
import { getDate, getTime } from '../utils/date.util';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventImplements,
    private readonly telegramService: TelegramService,
    private logger: Logger
  ) {
    this.logger = new Logger(EventService.name);
  }

  async findById(eventId: number) {
    return await this.eventRepository.findById(eventId);
  }

  async findByUser(userId: number) {
    return await this.eventRepository.findByUser(userId);
  }

  async findNextEvents(userId: number) {
    return await this.eventRepository.findNextEvents(userId);
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

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'todayNotification',
    timeZone: 'America/Sao_Paulo',
  })
  async todayNotificationsCron() {
    this.logger.log('Running today notifications...');
    const start = Date.now();
    const events = await this.eventRepository.findTodayEvents();
    for (const event of events) {
      const { user, title, startDate, endDate } = event;
      await this.telegramService.sendMessage(
        Number(user.idBot),
        `Você tem um evento programado para hoje:\n${title}\n
        Início: ${getDate(startDate)} ${getTime(startDate)}\n
        Fim: ${getDate(endDate)} ${getTime(endDate)}`
      );
    }
    const timeTaken = Date.now() - start;
    this.logger.log('Finished!');
    this.logger.log('Today Notification Execution time: ' + timeTaken + ' milliseconds');
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'tomorrowNotification',
    timeZone: 'America/Sao_Paulo',
  })
  async tomorrowNotificationsCron() {
    this.logger.log('Running tomorrow notifications...');
    const start = Date.now();
    const events = await this.eventRepository.findTomorrowEvents();
    for (const event of events) {
      const { user, title, startDate, endDate } = event;
      await this.telegramService.sendMessage(
        Number(user.idBot),
        `Você tem um evento programado para amanhã:\n${title}\n
        Início: ${getDate(startDate)} ${getTime(startDate)}\n
        Fim: ${getDate(endDate)} ${getTime(endDate)}`
      );
    }
    const timeTaken = Date.now() - start;
    this.logger.log('Finished!');
    this.logger.log('Tomorrow Notification Execution time: ' + timeTaken + ' milliseconds');
  }

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'nextHourNotification',
    timeZone: 'America/Sao_Paulo',
  })
  async nextHourNotificationsCron() {
    this.logger.log('Running next hour notifications...');
    const start = Date.now();
    const events = await this.eventRepository.findNextHourEvents();
    for (const event of events) {
      const { user, title, startDate } = event;
      await this.telegramService.sendMessage(
        Number(user.idBot),
        `Seu evento ${title}, começará as ${getTime(startDate)}!!!`
      );
    }
    const timeTaken = Date.now() - start;
    this.logger.log('Finished!');
    this.logger.log('Next Hour Notification Execution time: ' + timeTaken + ' milliseconds');
  }
}
