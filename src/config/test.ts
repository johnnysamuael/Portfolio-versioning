import PortfoliosResolver from '../resolvers/PortfolioResolver';
import ConfigInterface from './ConfigInterface';

const config: ConfigInterface = {
  env: 'test',
  database: {
    type: 'sqlite' as const,
    cache: false,
    database: ':memory:',
    dropSchema: true,
    entities: ['src/entities/*.ts'],
    logger: 'advanced-console' as const,
    synchronize: true,
  },
  graphQLPath: '/graphql',
  resolvers: [PortfoliosResolver],
};

export default config;
