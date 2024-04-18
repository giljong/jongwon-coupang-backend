import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { FileService, PrismaService } from 'src/services';
import { UserAuthGuard } from 'src/common/guard/user-auth.guard';

@Module({
  providers: [
    ProductResolver,
    ProductService,
    PrismaService,
    FileService,
    UserAuthGuard,
  ],
})
export class ProductModule {}
