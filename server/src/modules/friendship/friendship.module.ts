import { Module } from '@nestjs/common';
import { FriendshipsRepository } from './repositories/friendships.repository';
import { PrismaFriendshipsRepository } from './infra/db/repositories/prisma-friendships.repository';
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
    { provide: FriendshipsRepository, useClass: PrismaFriendshipsRepository },
  ],
  exports: [AddFriendService, GetFriendsService, FriendshipsRepository],
})
export class FriendshipModule {}
