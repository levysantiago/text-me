import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.strategy';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [JwtStrategy, JwtService],
})
export class HttpModule {}
