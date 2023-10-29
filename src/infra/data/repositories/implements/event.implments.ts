import { EventEntity } from '@entities/event.entity';

export abstract class EventImplements {
  abstract findById(eventId: number): Promise<EventEntity>;
  abstract findByUser(userId: number): Promise<EventEntity[]>;
  abstract findNextEvents(userId: number): Promise<EventEntity[]>;
  abstract findTodayEvents(): Promise<EventEntity[]>;
  abstract findTomorrowEvents(): Promise<EventEntity[]>;
  abstract findNextHourEvents(): Promise<EventEntity[]>;
  abstract createEvent(body: EventEntity): Promise<EventEntity>;
  abstract updateEvent(eventId: number, body: EventEntity): Promise<EventEntity>;
  abstract deleteEvent(userId: number): Promise<void>;
}
