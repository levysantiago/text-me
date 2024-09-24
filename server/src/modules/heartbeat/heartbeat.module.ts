import { Module } from '@nestjs/common';
import { HeartbeatController } from './infra/http/controllers';

@Module({
  controllers: [HeartbeatController],
})
export class HeartbeatModule {}
