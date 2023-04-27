import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { CreateMessageService } from 'src/app/services/create-message.service';
import { DatabaseModule } from 'src/infra/database/database.module';
import { JwtService } from '@nestjs/jwt';
import { VisualizeMessagesService } from 'src/app/services/visualize-messages.service';
import { GetFriendsService } from 'src/app/services/get-friends.service';

@Module({
  providers: [
    CreateMessageService,
    VisualizeMessagesService,
    GetFriendsService,
    JwtService,
    MyGateway,
  ],
  imports: [DatabaseModule],
})
export class GatewayModule {}
