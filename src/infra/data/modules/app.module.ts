import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { HandlerModule } from './handler.module';
import { SessionMiddleware } from '@middlewares/session.middleware';
import { BotName } from '../../../applications/app.constants';
import { ConfigModule } from '@nestjs/config';
import { DataModule } from './data.module';
import { UserModule } from './user.module';
import { JwtModule } from '@nestjs/jwt';
import { EventModule } from './event.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from './logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TelegrafModule.forRootAsync({
      botName: BotName,
      useFactory: () => ({
        token: process.env.BOT_TOKEN,
        middlewares: [SessionMiddleware],
        include: [HandlerModule],
      }),
    }),
    LoggerModule,
    ScheduleModule.forRoot(),
    HandlerModule,
    DataModule,
    UserModule,
    EventModule,
  ],
})
export class AppModule {}
