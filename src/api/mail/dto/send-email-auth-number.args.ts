import { ArgsType, Field } from "@nestjs/graphql";
import { IsEmail } from "class-validator";

@ArgsType()
export class SendEmailAuthNumberArgs {
    @Field(() => String, {description:'이메일'})
    @IsEmail({},{message:'올바른 이메일을 입력하세요'})
    email: string;
}