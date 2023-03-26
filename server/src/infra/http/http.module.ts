import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/app/services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { DatabaseModule } from '../database/database.module';
import { env } from 'src/env';
import { GetFriendsService } from 'src/app/services/get-friends.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { GetFriendsController } from './controllers/get-friends.controller';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController, GetFriendsController],
  providers: [AuthService, GetFriendsService, JwtStrategy],
})
export class HttpModule {}
