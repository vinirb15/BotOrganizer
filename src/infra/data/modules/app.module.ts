import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { GreeterModule } from './greeter.module';
import { SessionMiddleware } from '@middlewares/session.middleware';
import { BotName } from '../../../applications/app.constants';
import { ConfigModule } from '@nestjs/config';
import { DataModule } from './data.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      botName: BotName,
      useFactory: () => ({
        token: process.env.BOT_TOKEN,
        middlewares: [SessionMiddleware],
        include: [GreeterModule],
      }),
    }),
    GreeterModule,
    DataModule,
    UserModule,
  ],
})
export class AppModule {}
