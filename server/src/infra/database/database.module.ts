import { Module } from '@nestjs/common';
import { UserRepository } from 'src/app/repositories/user-repository';
import { CacheUserRepository } from './cache/repositories/cache-user-repository';
import { CacheMessageRepository } from './cache/repositories/cache-message-repository';
import { MessageRepository } from 'src/app/repositories/message-repository';
import { FriendshipRepository } from 'src/app/repositories/friendship-repository';
import { CacheFriendshipRepository } from './cache/repositories/cache-friendship-repository';

@Module({
  providers: [
    { provide: UserRepository, useClass: CacheUserRepository },
    { provide: MessageRepository, useClass: CacheMessageRepository },
    { provide: FriendshipRepository, useClass: CacheFriendshipRepository },
  ],
  exports: [UserRepository, MessageRepository, FriendshipRepository],
})
export class DatabaseModule {}
