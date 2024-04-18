import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class ValidateArgs {
  @Field(() => String, { description: '이메일' })
  @IsEmail({}, { message: '올바른 형식의 이메일을 입력하세요.' })
  email: string;
}
