import { Prisma } from './generated/prisma';
import { PubSub } from 'graphql-yoga';

declare global {
	interface Context {
		db: Prisma;
		request: any;
		pubsub: PubSub;
	}

	interface TokenPayload {
		userId: string;
	}
}
