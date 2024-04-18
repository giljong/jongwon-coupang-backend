import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '../cache/cache.module';
import { MailResolver } from './mail.resolver';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
              user: configService.get('MAIL_USER'),
              pass: configService.get('MAIL_PASS'),
            },
          },
        };
      },

      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          signOptions: {
            expiresIn: 60 * 60, // 1시간
            // expiresIn: 10, // 10초
          },
          secret: process.env.JWT_SECRET!,
        };
      },
      inject: [ConfigService],
    }),
    CacheModule,
    UserModule,
  ],
  providers: [MailService, MailResolver],
  exports: [MailService],
})
export class MailModule {}
