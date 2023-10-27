import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { GreeterModule } from './greeter.module';
import { SessionMiddleware } from '@middlewares/session.middleware';
import { BotName } from '../../../applications/app.constants';
import { ConfigModule } from '@nestjs/config';
import { DataModule } from './data.module';
import { UserModule } from './user.module';
import { JwtModule } from '@nestjs/jwt';
import { EventModule } from './event.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    TelegrafModule.forRootAsync({
      botName: BotName,
      useFactory: () => ({
        token: process.env.BOT_TOKEN,
        middlewares: [SessionMiddleware],
        include: [GreeterModule],
      }),
    }),
    ScheduleModule.forRoot(),
    GreeterModule,
    DataModule,
    UserModule,
    EventModule,
  ],
})
export class AppModule {}
