import { Module } from '@nestjs/common';
import { FriendshipRepository } from './repositories/friendship.repository';
import { PrismaFriendshipRepository } from './infra/db/repositories/prisma-friendship.repository';
import { AddFriendService } from './services/add-friend.service';
import { GetFriendsService } from './services/get-friends.service';
import { AddFriendshipController } from './infra/http/controllers/add-friendship.controller';
import { GetFriendsController } from './infra/http/controllers/get-friends.controller';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AddFriendshipController, GetFriendsController],
  providers: [
    AddFriendService,
    GetFriendsService,
    { provide: FriendshipRepository, useClass: PrismaFriendshipRepository },
  ],
  exports: [AddFriendService, GetFriendsService, FriendshipRepository],
})
export class FriendshipModule {}
