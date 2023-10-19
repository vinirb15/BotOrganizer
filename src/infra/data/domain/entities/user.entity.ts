export class UserEntity {
  public id?: number;
  public idBot?: string;
  public phoneNumber: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public password?: string;
  public accessToken?: string;

  constructor(data: UserEntity) {
    Object.assign(this, {
      ...data,
    });
  }
}
