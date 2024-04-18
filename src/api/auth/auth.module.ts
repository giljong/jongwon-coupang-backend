import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserStrategy } from './auth.strategy';

@Module({
  imports: [],
  providers: [UserStrategy, AuthService],
  exports: [AuthService],
})
export class UserModule {}
