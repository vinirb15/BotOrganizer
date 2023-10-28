import { UserEntity } from './user.entity';

export class EventEntity {
  public eventId?: number;
  public userId: number;
  public title: string;
  public address?: string;
  public startDate: Date;
  public endDate: Date;
  public repeat: string;
  public guests?: string;
  public notes?: string;
  public orderId?: number;
  public user?: Partial<UserEntity>;

  constructor(data: EventEntity) {
    Object.assign(this, {
      ...data,
    });
  }
}
