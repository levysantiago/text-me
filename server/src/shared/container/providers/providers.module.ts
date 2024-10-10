import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database-provider/database.module';

@Global()
@Module({
  imports: [DatabaseModule],
})
export class ProvidersModule {}
