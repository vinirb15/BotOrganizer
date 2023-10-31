import { Command, Ctx, Hears, Start, Update, Sender } from 'nestjs-telegraf';
import { Context } from '@interfaces/context.interface';
import { CREATE_USER_SCENE_ID } from '../../applications/app.constants';
import { EventGuard } from '@guards/event.guard';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TelegrafExceptionFilter } from 'src/applications/common/filters/telegraf-exception.filter';

@Update()
@UseFilters(new TelegrafExceptionFilter())
export class GreeterUpdate {
  @Start()
  onStart(): string {
    return 'Diga olá!';
  }

  @Hears(/olá|ola|oi/iu)
  onGreetings(@Sender('first_name') firstName: string): string {
    return `Olá ${firstName}, seja bem vindo!`;
  }

  @Command('login')
  async onLoginCreate(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(CREATE_USER_SCENE_ID);
  }

  @Hears(/thx|obrigado|valeu/iu)
  @UseGuards(EventGuard)
  onAcknowledgment(): string {
    return `Por nada! ✌️`;
  }

  @Hears(/ajuda|ajudar|help/iu)
  @Command('help')
  onHelp(): string {
    return `Opções de eventos:
    /criar - criar um novo evento
    /editar - edita informações do evento
    /proximos - lista seus próximos eventos
    todos os eventos são notificados 1 dia antes e no dia que ocorrerá `;
  }
}
