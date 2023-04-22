import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { CreateMessageService } from 'src/app/services/create-message.service';
import { DatabaseModule } from 'src/infra/database/database.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CreateMessageService, JwtService, MyGateway],
  imports: [DatabaseModule],
})
export class GatewayModule {}
