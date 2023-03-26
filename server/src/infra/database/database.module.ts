import { Module } from '@nestjs/common';
import { UserRepository } from 'src/app/repositories/user-repository';
import { CacheUserRepository } from './cache/repositories/cache-user-repository';

@Module({
  providers: [{ provide: UserRepository, useClass: CacheUserRepository }],
  exports: [UserRepository],
})
export class DatabaseModule {}
