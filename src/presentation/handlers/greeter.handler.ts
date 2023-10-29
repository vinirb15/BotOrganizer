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

  @Hears(['Ola', 'Olá', 'olá', 'ola', 'Oi', 'oi'])
  onGreetings(@Sender('first_name') firstName: string): string {
    return `Olá ${firstName}, seja bem vindo!`;
  }

  @Command('login')
  async onLoginCreate(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(CREATE_USER_SCENE_ID);
  }

  @Hears(['thx', 'obrigado', 'valeu'])
  @UseGuards(EventGuard)
  onAcknowledgment(): string {
    return `Por nada! ✌️`;
  }
}
