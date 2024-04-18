import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import {
  GraphQLError,
  NoSchemaIntrospectionCustomRule,
  ValidationRule,
} from 'graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPlugin } from '@apollo/server';
import * as depthLimit from 'graphql-depth-limit';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createGqlOptions(): ApolloDriverConfig {
    let csrfPrevention = true;

    const plugins: ApolloServerPlugin<any>[] = [];

    const validationRules: ValidationRule[] = [];

    const formatError = (error: GraphQLError) => {
      const graphQLFormattedError = {
        message: error.message,
        code: error.extensions['code'],
        status: error.extensions['status'],
      };

      return graphQLFormattedError;
    };

    if (this.configService.get('NODE_ENV') === 'production') {
      validationRules.push(NoSchemaIntrospectionCustomRule);
    } else {
      csrfPrevention = false;
      plugins.push(
        ApolloServerPluginLandingPageLocalDefault({
          footer: false,
          includeCookies: true,
        }),
      );
    }

    return {
      driver: ApolloDriver,
      path: '/graphql',
      autoSchemaFile: './schema.graphql',
      playground: false,
      fieldResolverEnhancers: ['guards'],
      installSubscriptionHandlers: true,
      csrfPrevention,
      plugins,
      validationRules,
      formatError,
    };
  }
}
