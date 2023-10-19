import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { Context } from '@interfaces/context.interface';
import { UserService } from '@services/user.service';

@Injectable()
export class EventGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();
    const validSession = await this.userService.isValidIdBot(String(from.id));

    if (!validSession) {
      throw new TelegrafException('Sessão expirada, logue novamente.');
    }

    return true;
  }
}
