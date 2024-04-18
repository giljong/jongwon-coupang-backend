import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { FileService } from 'src/services';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateProductArgs, DeleteProductArgs } from './dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {}

  async a() {
    return 'hello';
  }

  async findManyProduct() {
    const products = await this.prismaService.product.findMany();

    return products.map(async (v) => {
      const image = await this.getProductFile(v.image);
      return { ...v, image };
    });
  }

  async createProduct({ description, link, file }: CreateProductArgs) {
    const bucket = this.configService.get('PRODUCT_IMAGE_BUCKET');
    const _file = await file;
    const image = await this.fileService.uploadFile(
      _file.createReadStream(),
      _file.filename,
      bucket,
    );

    const productCount = await this.prismaService.product.count();

    await this.prismaService.product.create({
      data: {
        description,
        image: image.Key,
        link,
        no: productCount + 1,
      },
    });

    return true;
  }

  async deleteProduct({ id }: DeleteProductArgs) {
    const bucket = this.configService.get('PRODUCT_IMAGE_BUCKET');

    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('존재하지 않는 상품입니다.');
    }

    const transaction = [];

    transaction.push(this.prismaService.product.delete({ where: { id } }));
    transaction.push(
      this.prismaService.product.updateMany({
        data: { no: { decrement: 1 } },
        where: { id: { gt: id } },
      }),
    );

    await this.prismaService.$transaction(transaction);

    this.fileService.deleteFiles(bucket, [product.image]);

    return true;
  }

  async getProductFile(name: string) {
    const bucket = this.configService.get('PRODUCT_IMAGE_BUCKET');
    return this.fileService
      .getFile(bucket, name)
      .then(async (result) => {
        const mimeType = name.split('.')[1];
        const imageData = await result.Body.transformToString('base64');
        const dataUri = `data:image/${mimeType};base64,${imageData}`;
        return dataUri;
      })
      .catch(() => {
        throw new NotFoundException({
          message: '존재하지 않는 파일 입니다.',
        });
      });
  }
}
