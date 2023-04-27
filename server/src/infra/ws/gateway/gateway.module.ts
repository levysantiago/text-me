import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { CreateMessageService } from 'src/app/services/create-message.service';
import { DatabaseModule } from 'src/infra/database/database.module';
import { JwtService } from '@nestjs/jwt';
import { VisualizeMessagesService } from 'src/app/services/visualize-messages.service';
import { GetFriendsService } from 'src/app/services/get-friends.service';
import { GetUserService } from 'src/app/services/get-user.service';
import { AddFriendService } from 'src/app/services/add-friend.service';

@Module({
  providers: [
    CreateMessageService,
    VisualizeMessagesService,
    GetFriendsService,
    AddFriendService,
    GetUserService,
    JwtService,
    MyGateway,
  ],
  imports: [DatabaseModule],
})
export class GatewayModule {}
