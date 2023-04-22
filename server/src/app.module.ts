import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from './infra/http/http.module';
import { GatewayModule } from './infra/ws/gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../.env' }),
    GatewayModule,
    HttpModule,
  ],
})
export class AppModule {}
