import { GraphQLServer, Options } from 'graphql-yoga';
import { yupMiddleware } from 'graphql-yup-middleware';
import { extractFragmentReplacements } from 'prisma-binding';
import { Prisma } from './generated/prisma';
import { middlewares } from './middlewares/index';
import { permissions } from './permissions';
import { resolvers } from './resolvers';
import { generateTypeDefs } from './typeDefs';

export const db = new Prisma({
	fragmentReplacements: extractFragmentReplacements(resolvers),
	endpoint: process.env.PRISMA_ENDPOINT,
	secret: process.env.PRISMA_SECRET,
	debug: process.env.NODE_ENV === 'development'
});

export const options: Options = {};

export const createGraphQLServer = () => {
	generateTypeDefs();

	return new GraphQLServer({
		typeDefs: ['./src/generated/schema.graphql'],
		resolvers,
		context: req => ({ ...req, db }),
		middlewares: [permissions, yupMiddleware(), ...middlewares],
		resolverValidationOptions: {
			requireResolversForResolveType: false
		}
	});
};

export const createServer = () => createGraphQLServer().createHttpServer(options);

export const graphqlServer = createGraphQLServer();

export const server = graphqlServer.createHttpServer(options);
