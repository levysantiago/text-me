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
import { GetFriendsMessagesResumeService } from 'src/app/services/get-friends-messages-resume.service';
import { GetFriendsMessagesResumeController } from './controllers/get-amount-of-unseen-messages.controller';
import { CreateUserService } from 'src/app/services/create-user.service';
import { CreateUserController } from './controllers/create-user.controller';
import { UpdateUserService } from 'src/app/services/update-user.service';
import { UpdateUserController } from './controllers/update-user.controller';

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
    GetFriendsMessagesResumeController,
    CreateUserController,
    UpdateUserController,
  ],
  providers: [
    AuthService,
    GetFriendsService,
    GetMessagesService,
    GetFriendsMessagesResumeService,
    CreateUserService,
    UpdateUserService,
    JwtStrategy,
  ],
})
export class HttpModule {}
