import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventsGateway } from './gateways/events.gateway';
import { UserModule } from '@modules/user/user.module';
import { ChatModule } from '@modules/chat/chat.module';
import { FriendshipModule } from '@modules/friendship/friendship.module';

@Module({
  imports: [UserModule, ChatModule, FriendshipModule],
  providers: [JwtService, EventsGateway],
})
export class WsModule {}
