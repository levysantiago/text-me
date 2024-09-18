import { Module } from '@nestjs/common';
import { MessageRepository } from './repositories/message.repository';
import { PrismaMessageRepository } from './infra/db/repositories/prisma-message.repository';
import { CreateMessageService } from './services/create-message.service';
import { GetMessagesService } from './services/get-messages.service';
import { VisualizeMessagesService } from './services/visualize-messages.service';
import { GetAmountOfUnseenMessagesController } from './infra/http/controllers/get-amount-of-unseen-messages.controller';
import { GetMessagesController } from './infra/http/controllers/get-messages.controller';
import { GetFriendsMessagesResumeService } from './services/get-friends-messages-resume.service';
import { FriendshipModule } from '@modules/friendship/friendship.module';

@Module({
  imports: [FriendshipModule],
  controllers: [GetAmountOfUnseenMessagesController, GetMessagesController],
  providers: [
    CreateMessageService,
    GetMessagesService,
    VisualizeMessagesService,
    GetFriendsMessagesResumeService,
    { provide: MessageRepository, useClass: PrismaMessageRepository },
  ],
  exports: [CreateMessageService, VisualizeMessagesService, MessageRepository],
})
export class ChatModule {}
