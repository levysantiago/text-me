import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProvidersModule } from '@shared/container/providers/providers.module';
import { JwtStrategy } from '@shared/infra/http/guards/jwt.strategy';
import { HttpModule } from '@shared/infra/http/http.module';
import { WsModule } from '@shared/infra/ws/gateway.module';
import { UserModule } from '@modules/user/user.module';
import { ChatModule } from '@modules/chat/chat.module';
import { FriendshipModule } from '@modules/friendship/friendship.module';
import { AuthModule } from '@modules/auth/auth.module';
import { HeartbeatModule } from '@modules/heartbeat/heartbeat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../.env' }),
    HttpModule,
    HeartbeatModule,
    AuthModule,
    UserModule,
    ChatModule,
    FriendshipModule,
    ProvidersModule,
    WsModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
