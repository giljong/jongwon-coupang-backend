import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService as NestMailService } from '@nestjs-modules/mailer';
import { EMAIL_AUTH_NUMBER_KEY } from '../cache/cache.key';
import { CacheService } from '../cache/cache.service';
import { SendEmailAuthNumberArgs, VerifyEmailAuthNumberArgs } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MailService {
  constructor(
    private readonly MailService: NestMailService,
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
  ) {}

  async sendEmailAuthNumber({
    email,
  }: SendEmailAuthNumberArgs): Promise<Boolean> {
    const randomNumber = this.generateRandomNumber().toString();
    const ttl = 180;

    await this.cacheService.set(
      EMAIL_AUTH_NUMBER_KEY(email),
      randomNumber,
      ttl,
    );

    await this.sendAuthNumber(email, randomNumber);

    console.log(randomNumber);

    return true;
  }

  async verifyEmailAuthNumber({
    email,
    authNumber,
  }: VerifyEmailAuthNumberArgs): Promise<string> {
    const savedAuthNumber = await this.cacheService.get(
      EMAIL_AUTH_NUMBER_KEY(email),
    );

    console.log(savedAuthNumber);
    if (!savedAuthNumber) {
      throw new BadRequestException(
        '인증번호가 만료되었습니다.\n다시 요청해주시기 바랍니다.',
      );
    }

    if (savedAuthNumber !== authNumber) {
      throw new BadRequestException('인증번호가 올바르지 않습니다.');
    }

    const accessToken = this.jwtService.sign({
      email,
    });

    return accessToken;
  }

  private sendAuthNumber(to: string, authNumber: string): Promise<boolean> {
    return this.MailService.sendMail({
      to,
      subject: '[쿠팡 백엔드] 인증 번호 전송',
      text: authNumber,
    })
      .then((result) => {
        console.log({ result });

        return true;
      })
      .catch((error) => {
        console.log({ error });

        return false;
      });
  }

  // 랜덤 6자리 숫자 생성
  private generateRandomNumber(): number {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
