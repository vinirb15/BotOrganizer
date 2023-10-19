import { Command, Hears, Update, Sender, Ctx } from 'nestjs-telegraf';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';
import { UpdateType } from '@decorators/update-type.decorator';
import { AdminGuard } from '@guards/admin.guard';
import { UseGuards } from '@nestjs/common';
import { WizardContext } from 'telegraf/typings/scenes';

@Update()
export class LogedUserHandler {
  @Hears(/^(?=.*\bcriar\b)(?=.*\bevento\b).*\?$/i)
  helpToCreate(): string {
    return 'Para criar um evento digite: "criar evento" e siga os passos sugeridos';
  }

  @Hears(/criar.*evento|evento.*criar/)
  onGreetings(
    @Ctx() ctx: WizardContext,
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string
  ): string {
    return `Hey ${firstName}`;
  }

  @Command('admin')
  @UseGuards(AdminGuard)
  onAdminCommand(): string {
    return 'Welcome judge';
  }
}
