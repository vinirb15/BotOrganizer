import { Command, Ctx, Hears, Start, Update, Sender } from 'nestjs-telegraf';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';
import { Context } from '@interfaces/context.interface';
import {
  HELLO_SCENE_ID,
  WIZARD_SCENE_ID,
  CREATE_USER_SCENE_ID,
} from '../../applications/app.constants';
import { UpdateType } from '@decorators/update-type.decorator';
import { AdminGuard } from '@guards/admin.guard';
import { EventGuard } from '@guards/event.guard';
import { UseGuards } from '@nestjs/common';

@Update()
export class GreeterUpdate {
  @Start()
  onStart(): string {
    return 'Say hello to me';
  }

  @Hears(['hi', 'hello', 'hey', 'qq'])
  @UseGuards(EventGuard)
  onGreetings(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string
  ): string {
    return `Hey ${firstName}`;
  }

  @Command('scene')
  async onSceneCommand(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(HELLO_SCENE_ID);
  }

  @Command('wizard')
  async onWizardCommand(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(WIZARD_SCENE_ID);
  }

  @Command('login')
  async onLoginCreate(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(CREATE_USER_SCENE_ID);
  }

  @Command('admin')
  @UseGuards(AdminGuard)
  onAdminCommand(): string {
    return 'Welcome judge';
  }
}
