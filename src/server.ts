import { GraphQLServer } from 'graphql-yoga';
import { extractFragmentReplacements } from 'prisma-binding';
import { Prisma } from './generated/prisma';
import { middlewares } from './middlewares/index';
import { permissions } from './permissions';
import { resolvers } from './resolvers';
import { generateTypeDefs } from './typeDefs';

export const startServer = async () => {
	const db = new Prisma({
		fragmentReplacements: extractFragmentReplacements(resolvers),
		endpoint: process.env.PRISMA_ENDPOINT,
		secret: process.env.PRISMA_SECRET,
		debug: true
	});

	generateTypeDefs();

	const server = new GraphQLServer({
		typeDefs: './src/generated/schema.graphql',
		resolvers,
		context: req => ({ ...req, db }),
		middlewares: [permissions, ...middlewares]
	});
	return await server.start();
};
