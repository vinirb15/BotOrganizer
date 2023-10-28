import { Injectable } from '@nestjs/common';
import { Events, Prisma } from '@prisma/client';
import { EventEntity } from '../../domain/entities/event.entity';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class PrismaEventMapper {
  toPrisma(data: EventEntity): Prisma.EventsCreateInput {
    return {
      Users: {
        connect: {
          id: data.userId,
        },
      },
      title: data.title,
      address: data.address,
      startDate: data.startDate,
      endDate: data.endDate,
      repeat: data.repeat,
      guests: data.guests,
      notes: data.notes,
    };
  }

  toDomain(data: Events) {
    return new EventEntity({
      userId: data.userId,
      title: data.title,
      address: data.address,
      startDate: data.startDate,
      endDate: data.endDate,
      repeat: data.repeat,
      guests: data.guests,
      notes: data.notes,
    });
  }

  todayEvents(
    data: Events & {
      Users: UserEntity;
    }
  ) {
    return new EventEntity({
      userId: data.userId,
      title: data.title,
      address: data.address,
      startDate: data.startDate,
      endDate: data.endDate,
      repeat: data.repeat,
      guests: data.guests,
      notes: data.notes,
      user: data.Users
        ? {
            id: data.Users.id,
            idBot: data.Users.idBot,
          }
        : null,
    });
  }

  nextEvents(data: Events, orderId: number) {
    return new EventEntity({
      eventId: data.id,
      userId: data.userId,
      title: data.title,
      address: data.address,
      startDate: data.startDate,
      endDate: data.endDate,
      repeat: data.repeat,
      guests: data.guests,
      notes: data.notes,
      orderId,
    });
  }
}
