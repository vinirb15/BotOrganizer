import { Hears, Update, Ctx, Command } from 'nestjs-telegraf';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TelegrafExceptionFilter } from '@filters/telegraf-exception.filter';
import { Context } from '@interfaces/context.interface';
import {
  CREATE_EVENT_SCENE_ID,
  DELETE_EVENT_SCENE_ID,
  GET_EVENT_SCENE_ID,
  UPDATE_EVENT_SCENE_ID,
} from '@applications/app.constants';
import { EventGuard } from '@guards/event.guard';
import { EventService } from '@services/event.service';
import { UserService } from '@services/user.service';
import { TelegramService } from '@services/telegram.service';
import { getDate } from 'src/applications/utils/date.util';

@Update()
@UseGuards(EventGuard)
@UseFilters(new TelegrafExceptionFilter())
export class LogedUserHandler {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly telegramService: TelegramService
  ) {}

  @Hears(/^(?=.*\bcriar\b)(?=.*\bevento\b).*\?$/iu)
  helpToCreate(): string {
    return 'Para criar um evento digite: "criar evento" e siga os passos sugeridos';
  }

  @Hears(/criar.*evento|evento.*criar/iu)
  @Hears(/novo.*evento|evento.*novo/iu)
  @Command('criar')
  async onCreateEvent(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(CREATE_EVENT_SCENE_ID);
  }

  @Hears(/atualizar.*evento|evento.*atualizar/iu)
  @Hears(/editar.*evento|evento.*editar/iu)
  @Command('editar')
  @Command('atualizar')
  async onUpdateEvent(@Ctx() ctx: Context): Promise<void> {
    await this.telegramService.sendMessage(
      ctx.message.from.id,
      'Selecione o Id do evento escolhido'
    );
    await ctx.scene.enter(UPDATE_EVENT_SCENE_ID);
  }

  @Hears(/próximos.*eventos|eventos.*próximos/iu)
  @Hears(/proximos.*eventos|eventos.*proximos/iu)
  @Command('proximos')
  async onNextEvents(@Ctx() ctx: Context): Promise<string> {
    const { id: userId } = await this.userService.findByBotId(String(ctx.message.from.id));
    const events = await this.eventService.findNextEvents(userId);
    if (!events || events.length === 0) {
      await ctx.scene.leave();
      return 'Nenhum evento encontrado';
    }

    return `Seus próximos eventos:\n${events
      .map((e) => {
        return `${e.title} - Início/Fim: ${getDate(e.startDate) + ' ' + getDate(e.endDate)}`;
      })
      .join('\n')
      .toString()}`;
  }

  @Hears(/deletar.*evento|evento.*deletar/iu)
  @Hears(/excluir.*evento|evento.*excluir/iu)
  @Command('excluir')
  @Command('remover')
  @Command('deletar')
  async onDeleteEvent(@Ctx() ctx: Context): Promise<void> {
    await this.telegramService.sendMessage(
      ctx.message.from.id,
      'Selecione o Id do evento escolhido'
    );
    await ctx.scene.enter(DELETE_EVENT_SCENE_ID);
  }

  @Hears(/buscar.*eventos|eventos.*buscar/iu)
  @Hears(/buscar.*evento|evento.*buscar/iu)
  @Hears(/procurar.*eventos|eventos.*procurar/iu)
  @Hears(/procurar.*evento|evento.*procurar/iu)
  @Command('buscar')
  @Command('procurar')
  async onFindEvent(@Ctx() ctx: Context): Promise<void> {
    await this.telegramService.sendMessage(
      ctx.message.from.id,
      'Selecione o Id do evento escolhido'
    );
    await ctx.scene.enter(GET_EVENT_SCENE_ID);
  }
}
