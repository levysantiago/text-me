import { Module } from '@nestjs/common';
import { HeartbeatController } from './infra/http/controllers/heartbeat.controller';

@Module({
  controllers: [HeartbeatController],
})
export class HeartbeatModule {}
