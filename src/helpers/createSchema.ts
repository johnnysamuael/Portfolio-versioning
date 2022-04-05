import { GraphQLSchema } from 'graphql';
import { BuildSchemaOptions, buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';
import PortfoliosResolver from '../resolvers/PortfolioResolver';

export function createSchema(options?: Omit<BuildSchemaOptions, 'resolvers'>): GraphQLSchema {
  return buildSchemaSync({
    resolvers: [PortfoliosResolver],
    emitSchemaFile: true,
    container: Container,
    validate: true,
    ...options,
  });
}
