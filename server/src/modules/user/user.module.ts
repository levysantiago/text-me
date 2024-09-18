import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user-repository';
import { PrismaUserRepository } from './infra/db/repositories/prisma-user-repository';
import { CreateUserService } from './services/create-user.service';
import { GetUserService } from './services/get-user.service';
import { UpdateUserService } from './services/update-user.service';
import { CreateUserController } from './infra/http/controllers/create-user.controller';
import { UpdateUserController } from './infra/http/controllers/update-user.controller';

@Module({
  imports: [],
  controllers: [CreateUserController, UpdateUserController],
  providers: [
    CreateUserService,
    GetUserService,
    UpdateUserService,
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
  exports: [UserRepository, GetUserService],
})
export class UserModule {}
