import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidateArgs } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  validate({ email }: ValidateArgs) {
    const ownerEmail = this.configService.get('OWNER_EMAIL');
    console.log(email);

    if (ownerEmail !== email) {
      throw new UnauthorizedException({
        message: '접근 권한이 없습니다.',
      });
    }

    return true;
  }
}
