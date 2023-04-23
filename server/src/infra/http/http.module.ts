import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/app/services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { DatabaseModule } from '../database/database.module';
import { env } from 'src/env';
import { GetFriendsService } from 'src/app/services/get-friends.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { GetFriendsController } from './controllers/get-friends.controller';
import { CheckLoginController } from './controllers/check-login.controller';
import { GetMessagesService } from 'src/app/services/get-messages.service';
import { GetMessagesController } from './controllers/get-messages.controller';
import { GetAmountOfUnseenMessagesService } from 'src/app/services/get-amount-of-unseen-messages.service';
import { GetAmountOfUnseenMessagesController } from './controllers/get-amount-of-unseen-messages.controller';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    AuthController,
    GetFriendsController,
    CheckLoginController,
    GetMessagesController,
    GetAmountOfUnseenMessagesController,
  ],
  providers: [
    AuthService,
    GetFriendsService,
    GetMessagesService,
    GetAmountOfUnseenMessagesService,
    JwtStrategy,
  ],
})
export class HttpModule {}
