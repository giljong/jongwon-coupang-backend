import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, IsNumberString } from 'class-validator';

@ArgsType()
export class VerifyEmailAuthNumberArgs {
  @Field(() => String, { description: '이메일' })
  @IsEmail({}, { message: '올바른 이메일을 입력하세요' })
  email: string;

  @Field(() => String, { description: '인증번호' })
  @IsNumberString({}, { message: '올바른 인증번호를 입력하세요' })
  authNumber: string;
}
