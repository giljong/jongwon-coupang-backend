import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { ProductEntity } from 'src/entity';
import { CreateProductArgs, DeleteProductArgs } from './dto';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/common/guard/user-auth.guard';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => String, { description: '테스트' })
  hello() {
    return this.productService.a();
  }

  @Query(() => [ProductEntity], { description: '상품 목록 조회' })
  @UseGuards(UserAuthGuard)
  findManyProduct() {
    return this.productService.findManyProduct();
  }

  @Mutation(() => Boolean, { description: '상품 생성' })
  @UseGuards(UserAuthGuard)
  createProcut(@Args() createProductArgs: CreateProductArgs) {
    return this.productService.createProduct(createProductArgs);
  }

  @Mutation(() => Boolean, { description: '상품 삭제' })
  @UseGuards(UserAuthGuard)
  deleteProcut(@Args() deleteProductArgs: DeleteProductArgs) {
    return this.productService.deleteProduct(deleteProductArgs);
  }
}
