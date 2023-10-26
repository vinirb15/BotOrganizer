import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@data/prisma/clients/prisma.service';
import { EventImplements } from './implements/event.implments';
import { EventEntity } from '../domain/entities/event.entity';
import { PrismaEventMapper } from '../prisma/mappers/event.mapper';

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

  async createEvent(body: EventEntity): Promise<EventEntity> {
    const event = await this.prisma.events.create({
      data: this.eventMapper.toPrisma(body),
    });

    return this.eventMapper.toDomain(event);
  }
  async updateEvent(body: EventEntity): Promise<EventEntity> {
    const event = await this.prisma.events.update({
      data: this.eventMapper.toPrisma(body),
      where: {
        id: body.eventId,
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
