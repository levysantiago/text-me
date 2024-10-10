import { Global, Module } from '@nestjs/common';
import { PrismaDatabaseProvider } from './implementations/prisma-database.provider';

@Global()
@Module({
  providers: [PrismaDatabaseProvider],
  exports: [PrismaDatabaseProvider],
})
export class DatabaseModule {}
