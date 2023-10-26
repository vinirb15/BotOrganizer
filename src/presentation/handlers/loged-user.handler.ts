import { Command, Hears, Update, Ctx } from 'nestjs-telegraf';
import { AdminGuard } from '@guards/admin.guard';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TelegrafExceptionFilter } from '@filters/telegraf-exception.filter';
import { Context } from '@interfaces/context.interface';
import { EVENT_SCENE_ID } from '@applications/app.constants';
import { EventGuard } from '@guards/event.guard';

@Update()
@UseGuards(EventGuard)
@UseFilters(new TelegrafExceptionFilter())
export class LogedUserHandler {
  @Hears(/^(?=.*\bcriar\b)(?=.*\bevento\b).*\?$/i)
  helpToCreate(): string {
    return 'Para criar um evento digite: "criar evento" e siga os passos sugeridos';
  }

  @Hears(/criar.*evento|evento.*criar/)
  async onCreateEvent(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(EVENT_SCENE_ID);
  }

  @Command('admin')
  @UseGuards(AdminGuard)
  onAdminCommand(): string {
    return 'Welcome judge';
  }
}
