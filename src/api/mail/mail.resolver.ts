import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MailService } from './mail.service';
import { SendEmailAuthNumberArgs, VerifyEmailAuthNumberArgs } from './dto';

@Resolver()
export class MailResolver {
  constructor(private readonly mailService: MailService) {}

  @Mutation(() => Boolean, { description: '이메일 인증번호 발송' })
  sendEmailAuthNumber(
    @Args() sendEmailAuthNumberArgs: SendEmailAuthNumberArgs,
  ) {
    return this.mailService.sendEmailAuthNumber(sendEmailAuthNumberArgs);
  }

  @Mutation(() => String, { description: '이메일 인증번호 발송' })
  verifyEmailAuthNumber(
    @Args() verifyEmailAuthNumberArgs: VerifyEmailAuthNumberArgs,
  ) {
    return this.mailService.verifyEmailAuthNumber(verifyEmailAuthNumberArgs);
  }
}
