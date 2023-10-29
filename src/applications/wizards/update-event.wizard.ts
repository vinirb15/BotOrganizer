import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { UPDATE_EVENT_SCENE_ID } from '../app.constants';
import { WizardContext } from 'telegraf/typings/scenes';
import { UseFilters } from '@nestjs/common';
import { TelegrafExceptionFilter } from '../common/filters/telegraf-exception.filter';
import { EventService } from '@services/event.service';
import { UserService } from '../services/user.service';
import { EventInterface } from '../interfaces/event.interface';
import { EventEntity } from 'src/infra/data/domain/entities/event.entity';
import { dateWithoutTz } from '../utils/date.util';
// import { EventInterface } from '../interfaces/event.interface';

@Wizard(UPDATE_EVENT_SCENE_ID)
@UseFilters(new TelegrafExceptionFilter())
export class UpdateEventWizard {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService
  ) {}
  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
    await ctx.wizard.next();
    const { id: userId } = await this.userService.findByBotId(String(ctx.message.from.id));
    const events = await this.eventService.findNextEvents(userId);

    if (!events) {
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
      await ctx.wizard.selectStep(1);
      return 'Id selecionado inválido';
    }

    ctx.wizard.state['eventId'] = event.eventId;

    await ctx.wizard.next();
    return 'Digite o nome do evento que gostaria atualizar...';
  }

  @On('text')
  @WizardStep(3)
  async onTitle(@Ctx() ctx: WizardContext, @Message() msg: { text: string }): Promise<string> {
    ctx.wizard.state['title'] = msg.text;
    await ctx.wizard.next();
    return 'Digite a data de início do evento no formato DD-MM-AAAA';
  }

  @On('text')
  @WizardStep(4)
  async onStartDate(@Ctx() ctx: WizardContext, @Message() msg: { text: string }): Promise<string> {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\-(0[1-9]|1[0-2])\-\d{4}$/;
    if (!regex.test(msg.text)) {
      await ctx.wizard.selectStep(2);
      return `Formato de data inválido, digite novamente...`;
    }
    ctx.wizard.state['startDate'] = msg.text;
    await ctx.wizard.next();
    return 'Digite o horário de início do evento no formato HH:MM';
  }

  @On('text')
  @WizardStep(5)
  async onStartTime(@Ctx() ctx: WizardContext, @Message() msg: { text: string }): Promise<string> {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regex.test(msg.text)) {
      await ctx.wizard.selectStep(3);
      return `Formato de horário inválido, digite novamente...`;
    }
    ctx.wizard.state['startTime'] = msg.text;
    await ctx.wizard.next();
    return 'Digite a data fim do evento no formato DD-MM-AAAA';
  }

  @On('text')
  @WizardStep(6)
  async onEndDate(@Ctx() ctx: WizardContext, @Message() msg: { text: string }): Promise<string> {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\-(0[1-9]|1[0-2])\-\d{4}$/;
    if (!regex.test(msg.text)) {
      await ctx.wizard.selectStep(4);
      return `Formato de data inválido, digite novamente...`;
    }
    ctx.wizard.state['endDate'] = msg.text;
    await ctx.wizard.next();
    return 'Digite o horário de fim do evento no formato HH:MM';
  }

  @On('text')
  @WizardStep(7)
  async onValidateDescription(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string }
  ): Promise<string> {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regex.test(msg.text)) {
      await ctx.wizard.selectStep(5);
      return `Formato de horário inválido, digite novamente...`;
    }
    ctx.wizard.state['endTime'] = msg.text;
    await ctx.wizard.next();
    return 'Gostaria de adicionar alguma descrição?';
  }

  @On('text')
  @WizardStep(8)
  async onDescription(
    @Ctx()
    ctx: WizardContext & {
      wizard: {
        state: {
          title: string;
          startDate: string;
          startTime: string;
          endDate: string;
          endTime: string;
          notes: string;
          eventId: number;
        };
      };
    },
    @Message() msg: { text: string }
  ): Promise<string> {
    const afirmativeResponse = ['Sim', 'sim', 's', 'Gostaria', 'gostaria'];

    const { id: userId } = await this.userService.findByBotId(String(ctx.message.from.id));
    const { title, startDate, startTime, endDate, endTime, notes, eventId } = ctx.wizard.state;

    const splitEndDate = endDate.split('-');
    const endDateFormated = splitEndDate[2] + '-' + splitEndDate[1] + '-' + splitEndDate[0];

    const splitStartDate = startDate.split('-');
    const startDateFormated = splitStartDate[2] + '-' + splitStartDate[1] + '-' + splitStartDate[0];

    const endDateTime = new Date(`${endDateFormated}T${endTime}`);
    const startDateTime = new Date(`${startDateFormated}T${startTime}`);

    const eventPayload = {
      userId,
      title,
      startDate: dateWithoutTz(startDateTime),
      endDate: dateWithoutTz(endDateTime),
      notes,
      repeat: 'no',
    };

    ctx.wizard.state['eventPayload'] = eventPayload;
    ctx.wizard.state['userId'] = userId;

    if (afirmativeResponse.includes(msg.text)) {
      await ctx.wizard.next();
      return `Digite a descrição do seu evento...`;
    }

    await this.eventService.updateEvent(eventId, eventPayload);

    await ctx.scene.leave();
    return 'Evento atualizado';
  }

  @On('text')
  @WizardStep(9)
  async onValidateDescriptiona(
    @Ctx()
    ctx: WizardContext & {
      wizard: {
        state: {
          userId: number;
          eventId: number;
          eventPayload: EventInterface;
        };
      };
    },
    @Message() msg: { text: string }
  ): Promise<string> {
    const { userId, eventId, eventPayload } = ctx.wizard.state;

    await this.eventService.updateEvent(eventId, { ...eventPayload, userId, notes: msg.text });

    await ctx.scene.leave();
    return 'Evento atualizado';
  }
}
