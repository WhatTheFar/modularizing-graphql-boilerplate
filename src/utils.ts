import { GraphQLResolveInfo } from 'graphql';
import * as jwt from 'jsonwebtoken';
import { Context, TokenPayload } from './types';

export function getUserId(context: Context) {
	const Authorization = context.request.headers.authorization;
	if (Authorization) {
		const token = Authorization.replace('Bearer ', '');
		const { userId } = jwt.verify(token, process.env.APP_SECRET!) as TokenPayload;
		return userId;
	}

	throw new AuthError();
}

export async function getUser(context: Context, info?: GraphQLResolveInfo | string) {
	const Authorization = context.request.headers.authorization;
	if (Authorization) {
		const token = Authorization.replace('Bearer ', '');
		const { userId } = jwt.verify(token, process.env.APP_SECRET!) as TokenPayload;
		const user = await context.db.query.user({ where: { id: userId } }, info);
		if (user != null) {
			return user;
		}
	}

	throw new AuthError();
}

export class AuthError extends Error {
	constructor() {
		super('Not authorized');
	}
}
