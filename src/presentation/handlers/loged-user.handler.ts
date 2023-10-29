import { Command, Hears, Update, Ctx } from 'nestjs-telegraf';
import { AdminGuard } from '@guards/admin.guard';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TelegrafExceptionFilter } from '@filters/telegraf-exception.filter';
import { Context } from '@interfaces/context.interface';
import { CREATE_EVENT_SCENE_ID, UPDATE_EVENT_SCENE_ID } from '@applications/app.constants';
import { EventGuard } from '@guards/event.guard';
import { EventService } from 'src/applications/services/event.service';
import { UserService } from 'src/applications/services/user.service';

@Update()
@UseGuards(EventGuard)
@UseFilters(new TelegrafExceptionFilter())
export class LogedUserHandler {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService
  ) {}

  @Hears(/^(?=.*\bcriar\b)(?=.*\bevento\b).*\?$/i)
  helpToCreate(): string {
    return 'Para criar um evento digite: "criar evento" e siga os passos sugeridos';
  }

  @Hears(/criar.*evento|evento.*criar/)
  async onCreateEvent(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(CREATE_EVENT_SCENE_ID);
  }

  @Hears(/atualizar.*evento|evento.*atualizar/)
  async onUpdateEvent(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(UPDATE_EVENT_SCENE_ID);
  }

  @Hears(/proximos.*evento|evento.*proximos/)
  async onNextEvents(@Ctx() ctx: Context): Promise<string> {
    const { id: userId } = await this.userService.findByBotId(String(ctx.message.from.id));
    const events = await this.eventService.findNextEvents(userId);
    if (!events) {
      await ctx.scene.leave();
      return 'Nenhum evento criado';
    }

    return `Seus próximos eventos:\n${events
      .map((e) => {
        return `${e.title} - Início/Fim: ${
          new Date(e.startDate).toLocaleDateString() +
          ' ' +
          new Date(e.endDate).toLocaleDateString()
        }`;
      })
      .join('\n')
      .toString()}`;
  }
}
