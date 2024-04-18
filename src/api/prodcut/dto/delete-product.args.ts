import { ArgsType, Field, PickType } from '@nestjs/graphql';
import { IsInt, IsString, IsUrl } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileSize } from 'src/common/decorators';
import { ProductEntity } from 'src/entity';

@ArgsType()
export class DeleteProductArgs extends PickType(ProductEntity, ['id']) {
  @Field({ description: '상품 ID' })
  @IsInt({ message: '상품 ID를 입력하세요.' })
  id: number;
}
