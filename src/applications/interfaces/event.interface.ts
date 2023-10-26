export class EventInterface {
  public eventId?: number;
  public userId: number;
  public title: string;
  public address?: string;
  public startDate: Date;
  public endDate: Date;
  public repeat: string;
  public guests?: string;
  public notes?: string;
}
