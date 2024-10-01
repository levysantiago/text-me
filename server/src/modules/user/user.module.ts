import { Module } from '@nestjs/common';
import { CreateUserService } from './services/create-user.service';
import { GetUserService } from './services/get-user.service';
import { UpdateUserService } from './services/update-user.service';
import { CreateUserController } from './infra/http/controllers/create-user.controller';
import { UpdateUserController } from './infra/http/controllers/update-user.controller';
import { PrismaUsersRepository } from './infra/db/repositories/prisma-user-repository';
import { UsersRepository } from './repositories/users-repository';

@Module({
  imports: [],
  controllers: [CreateUserController, UpdateUserController],
  providers: [
    CreateUserService,
    GetUserService,
    UpdateUserService,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
  ],
  exports: [UsersRepository, GetUserService],
})
export class UserModule {}
