interface UserInterface {
  idUser: string;
}

export class Action {
  private props: UserInterface;
  constructor(userInterface: UserInterface) {
    this.props = userInterface;
  }
  public set idUser(idUser: string) {
    this.props.idUser = idUser;
  }
  public get idUser() {
    return this.props.idUser;
  }
}
