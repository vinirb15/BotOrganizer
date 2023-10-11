import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataModule } from './data.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DataModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
