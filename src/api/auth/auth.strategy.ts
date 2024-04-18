import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { ValidateArgs } from './dto';

const jwtExtractor = (req) => {
  if (req.headers.authorization) {
    return req.headers.authorization.replace('Bearer ', '');
  }
};

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user-strategy') {
  constructor(
    readonly configService: ConfigService,
    readonly authService: AuthService,
  ) {
    super({
      name: 'user-strategy',
      jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  validate(payload: ValidateArgs) {
    console.log(payload);
    return this.authService.validate(payload);
  }
}
