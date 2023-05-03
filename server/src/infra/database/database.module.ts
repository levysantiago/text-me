import { Module } from '@nestjs/common';
import { UserRepository } from 'src/app/repositories/user-repository';
import { MessageRepository } from 'src/app/repositories/message-repository';
import { FriendshipRepository } from 'src/app/repositories/friendship-repository';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository';
import { PrismaMessageRepository } from './prisma/repositories/prisma-message-repository';
import { PrismaFriendshipRepository } from './prisma/repositories/prisma-friendship-repository';

@Module({
  providers: [
    PrismaService,
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: MessageRepository, useClass: PrismaMessageRepository },
    { provide: FriendshipRepository, useClass: PrismaFriendshipRepository },
  ],
  exports: [UserRepository, MessageRepository, FriendshipRepository],
})
export class DatabaseModule {}
