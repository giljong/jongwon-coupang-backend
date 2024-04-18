import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '@prisma/client';

@ObjectType({ description: '상품' })
export class ProductEntity implements Product {
  @Field(() => Int, { description: 'ID' })
  id: number;

  @Field(() => Int, { description: '상품 NO' })
  no: number;

  @Field(() => String, { description: '상품 설명' })
  description: string;

  @Field(() => String, { description: '상품 이미지' })
  image: string;

  @Field(() => String, { description: '상품 링크' })
  link: string;
}
