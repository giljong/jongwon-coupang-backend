import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlConfigService } from './services';
import { MailModule } from './api/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './api/prodcut/product.module';
import { CacheModule } from './api/cache/cache.module';
import { UserModule } from './api/auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
    }),
    ProductModule,
    CacheModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
