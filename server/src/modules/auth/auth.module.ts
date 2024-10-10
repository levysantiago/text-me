import { Module } from '@nestjs/common';
import { AuthController } from './infra/http/controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { CheckLoginController } from './infra/http/controllers/check-login.controller';
import { UserModule } from '@modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@shared/resources/env';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController, CheckLoginController],
  providers: [AuthService],
})
export class AuthModule {}
