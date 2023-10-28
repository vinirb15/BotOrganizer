import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@data/prisma/clients/prisma.service';
import { EventImplements } from './implements/event.implments';
import { EventEntity } from '../domain/entities/event.entity';
import { PrismaEventMapper } from '../prisma/mappers/event.mapper';
import {
  dateWithoutTz,
  endOfDay,
  startOfDay,
  tomorrowDate,
} from 'src/applications/utils/date.util';

@Injectable()
export class PrismaEventRepository implements EventImplements {
  constructor(
    private prisma: PrismaService,
    private eventMapper: PrismaEventMapper
  ) {}
  async findById(eventId: number): Promise<EventEntity> {
    const event = await this.prisma.events.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) throw new NotFoundException('Evento não encontrado.');

    return this.eventMapper.toDomain(event);
  }

  async findByUser(userId: number): Promise<EventEntity[]> {
    const events = await this.prisma.events.findMany({
      where: {
        userId: userId,
      },
    });

    if (!events) return [];

    return events.map((event) => {
      return this.eventMapper.toDomain(event);
    });
  }

  async findTodayEvents(): Promise<EventEntity[]> {
    const date = dateWithoutTz(new Date()).toISOString().split('T')[0];
    const startTime = startOfDay(date);
    const endTime = endOfDay(date);

    const events = await this.prisma.events.findMany({
      include: {
        Users: true,
      },
      where: {
        startDate: { gte: startTime },
        endDate: { lte: endTime },
      },
    });

    if (!events) return [];

    return events.map((event) => {
      return this.eventMapper.todayEvents(event);
    });
  }

  async findTomorrowEvents(): Promise<EventEntity[]> {
    const date = tomorrowDate().toISOString().split('T')[0];
    const startTime = startOfDay(date);
    const endTime = endOfDay(date);

    const events = await this.prisma.events.findMany({
      include: {
        Users: true,
      },
      where: {
        startDate: { gte: startTime },
        endDate: { lte: endTime },
      },
    });

    if (!events) return [];

    return events.map((event) => {
      return this.eventMapper.todayEvents(event);
    });
  }

  async findNextEvents(userId: number): Promise<EventEntity[]> {
    const date = dateWithoutTz(new Date());

    const events = await this.prisma.events.findMany({
      where: {
        userId,
        startDate: { gte: date },
      },
    });

    if (!events) return [];

    return events.map((event, index) => {
      return this.eventMapper.nextEvents(event, Number(index + 1));
    });
  }

  async createEvent(body: EventEntity): Promise<EventEntity> {
    const event = await this.prisma.events.create({
      data: this.eventMapper.toPrisma(body),
    });

    return this.eventMapper.toDomain(event);
  }

  async updateEvent(eventId: number, body: EventEntity): Promise<EventEntity> {
    const event = await this.prisma.events.update({
      data: this.eventMapper.toPrisma(body),
      where: {
        id: eventId,
      },
    });

    return this.eventMapper.toDomain(event);
  }

  async deleteEvent(eventId: number): Promise<void> {
    await this.prisma.events.update({
      data: {
        inactive: true,
      },
      where: {
        id: eventId,
      },
    });
  }
}
