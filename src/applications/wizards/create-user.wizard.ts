import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { CREATE_USER_SCENE_ID } from '../app.constants';
import { WizardContext } from 'telegraf/typings/scenes';
import { UserService } from '../services/user.service';

@Wizard(CREATE_USER_SCENE_ID)
export class CreateUserWizard {
  constructor(private readonly userService: UserService) {}
  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
    await ctx.wizard.next();
    return 'Bem vindo ao Bot Organizer ✋ Para comerçarmos digite seu e-mail';
  }

  @On('text')
  @WizardStep(2)
  async onAccess(@Ctx() ctx: WizardContext, @Message() msg: { text: string }): Promise<string> {
    try {
      const regex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
      if (!regex.test(msg.text)) {
        await ctx.wizard.selectStep(1);
        return `Formato de e-mail inválido, digite novamente...`;
      }

      ctx.wizard.state['email'] = msg.text;
      const existingUser = await this.userService.findByEmail(msg.text);

      if (existingUser) {
        await ctx.wizard.next();
        return `Olá ${existingUser.firstName}, digite sua senha de acesso...`;
      }
    } catch (error) {
      await ctx.wizard.next();
      await ctx.wizard.next();
      return 'Não foi encontrado um usuário com esse email, deseja criar uma nova conta?';
    }
  }

  @On('text')
  @WizardStep(3)
  async onValidatePasss(
    @Ctx()
    ctx: WizardContext & {
      wizard: { state: { email: string } };
    },
    @Message() msg: { text: string }
  ): Promise<string> {
    try {
      const { email } = ctx.wizard.state;
      const password = msg.text;
      const existingUser = await this.userService.login({ email, password });
      if (existingUser) {
        const { first_name: firstName, last_name: lastName } = ctx.message.from;
        await ctx.scene.leave();
        return `Bem vindo ${firstName} ${lastName}`;
      }
    } catch (error) {
      await ctx.wizard.selectStep(2);
      return 'Usuário ou senha incorretos, digite novamente...';
    }
  }

  @On('text')
  @WizardStep(4)
  async onValidateEmail(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string }
  ): Promise<string> {
    const afirmativeResponse = ['Sim', 'sim', 's'];

    if (afirmativeResponse.includes(msg.text)) {
      await ctx.wizard.next();
      return `Digite seu número de telefone neste formato: +55(12)999999999.`;
    }

    await ctx.scene.leave();
    return `Volte sempre ${ctx.message.from.first_name} 👋.`;
  }

  @On('text')
  @WizardStep(5)
  async onReceiveData(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string }
  ): Promise<string> {
    const regex = /^\+\d{2}\(\d{2}\)\d{9}$/;

    if (!regex.test(msg.text)) {
      await ctx.wizard.selectStep(4);
      return `Formato de telefone inválido, digite novamente...`;
    }

    ctx.wizard.state['phoneNumber'] = msg.text;
    await ctx.wizard.next();
    return `Digite uma senha qualquer...`;
  }

  @On('text')
  @WizardStep(6)
  async onRecievePass(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string }
  ): Promise<string> {
    ctx.wizard.state['password'] = msg.text;
    await ctx.wizard.next();
    return `Repita a senha...`;
  }

  @On('text')
  @WizardStep(7)
  async onValidatePass(
    @Ctx()
    ctx: WizardContext & {
      wizard: { state: { email: string; phoneNumber: string; password: string } };
    },
    @Message() msg: { text: string }
  ): Promise<string> {
    if (msg.text !== ctx.wizard.state.password) {
      await ctx.wizard.selectStep(4);
      return `As senhas são diferentes, digite novamente...`;
    }

    const { first_name: firstName, last_name: lastName } = ctx.message.from;
    const { email, password, phoneNumber } = ctx.wizard.state;

    const createUserObject = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
    };

    await this.userService.createUser(createUserObject);

    await ctx.scene.leave();
    return `Conta criada, bem vindo ${firstName} ${lastName}.`;
  }
}
