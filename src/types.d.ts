import { Prisma } from './generated/prisma';

declare global {
	interface Context {
		db: Prisma;
		request: any;
	}

	interface TokenPayload {
		userId: string;
	}
}
