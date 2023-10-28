import { Module } from '@nestjs/common';
import { MyLogger } from '@utils/logger.util';

@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule {}
