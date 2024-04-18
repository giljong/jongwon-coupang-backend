import { ArgsType, Field, PickType } from '@nestjs/graphql';
import { IsString, IsUrl } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileSize } from 'src/common/decorators';
import { ProductEntity } from 'src/entity';

@ArgsType()
export class CreateProductArgs extends PickType(ProductEntity, [
  'description',
  'link',
]) {
  @Field({ description: '상품 설명' })
  @IsString({ message: '상품 설명을 입력하세요.' })
  description: string;

  @Field({ description: '상품 URL' })
  @IsUrl({}, { message: '올바른 형식의 상품 URL을 입력하세요' })
  link: string;

  @Field(() => GraphQLUpload, {
    name: 'file',
    description: '첨부파일',
  })
  // FIXME: 운영에서 주석 풀어야함, 아폴로 스튜디오에서 작동 안해서 주석
  // @IsFile(
  //   { mime: ['jpeg', 'jpg', 'png', 'gif'] },
  //   {
  //     message:
  //       '첨부파일은 .png, .jpg, .jpeg, .gif 확장자로 등록해주세요.',
  //     each: true,
  //   },
  // )
  @FileSize(
    { size: 10, unit: 'mb' },
    {
      message: '첨부파일 사이즈는 최대 10MB 이하로 등록해주세요.',
      each: true,
    },
  )
  file: FileUpload;
}
