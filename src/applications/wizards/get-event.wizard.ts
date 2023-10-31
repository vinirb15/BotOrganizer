import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { GET_EVENT_SCENE_ID } from '../app.constants';
import { WizardContext } from 'telegraf/typings/scenes';
import { UseFilters } from '@nestjs/common';
import { TelegrafExceptionFilter } from '../common/filters/telegraf-exception.filter';
import { EventService } from '@services/event.service';
import { UserService } from '../services/user.service';
import { EventEntity } from 'src/infra/data/domain/entities/event.entity';
import { getDate, getTime } from '../utils/date.util';

@Wizard(GET_EVENT_SCENE_ID)
@UseFilters(new TelegrafExceptionFilter())
export class GetEventWizard {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService
  ) {}
  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
    await ctx.wizard.next();
    const { id: userId } = await this.userService.findByBotId(String(ctx.message.from.id));
    const events = await this.eventService.findNextEvents(userId);

    if (!events || events.length === 0) {
      await ctx.scene.leave();
      return 'Nenhum evento criado';
    }

    ctx.wizard.state['events'] = events;

    return `${events
      .map((e) => {
        return `ID: ${e.orderId} - Título: ${e.title}`;
      })
      .join('\n')
      .toString()}`;
  }

  @On('text')
  @WizardStep(2)
  async onSelectedScene(
    @Ctx()
    ctx: WizardContext & {
      wizard: {
        state: {
          events: EventEntity[];
        };
      };
    },
    @Message() msg: { text: string }
  ): Promise<string> {
    const { events } = ctx.wizard.state;
    const event = events.find((event) => event.orderId === Number(msg.text));
    if (!event) {
      await ctx.scene.leave();
      return 'Id selecionado inválido';
    }

    await ctx.scene.leave();
    return `
    Evento selecionado: 
      Título: ${event.title}
      Descrição: ${event.notes || 'Sem descrição'}
      Início: ${getDate(event.startDate)} ${getTime(event.startDate)}
      Fim: ${getDate(event.endDate)} ${getTime(event.endDate)}
    `;
  }
}
