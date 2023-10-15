export class UserEntity {
  public id?: number;
  public phoneNumber: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public password?: string;

  constructor(data: UserEntity) {
    Object.assign(this, {
      ...data,
    });
  }
}
