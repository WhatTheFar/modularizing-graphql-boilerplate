import * as request from 'supertest';
import { ISignupArgs } from './auth/auth.interfaces';
import { createUserToPrisma, generateToken } from './auth/auth.resolvers';
import { User, UserWhereUniqueInput } from './generated/prisma';
import { db } from './server';
import { graphqlServer, server } from './server';

interface IVariables {
	[key: string]: any;
}

export const mockUserArgs: ISignupArgs = {
	email: 'jakpat.m@gmail.com',
	password: 'password123',
	firstName: 'John',
	lastName: 'Doe'
};

export const requestGql = (query: string, variables?: IVariables) => {
	const body = JSON.stringify({
		query,
		variables
	});
	return request(server)
		.post(graphqlServer.options.endpoint || '/')
		.set('Content-Type', 'application/json')
		.send(body);
};

export const createTestUserIfNotExist = async (args: ISignupArgs) => {
	if (!(await db.exists.User({ email: args.email }))) {
		await createUserToPrisma(db, args);
	}
};

export const getUserBearerToken = async (userWhereUniqueInput: UserWhereUniqueInput) => {
	const user = (await db.query.user({ where: userWhereUniqueInput })) as User;
	return `Bearer ${generateToken(user)}`;
};

export const deleteTestUserIfExists = async (
	userWhereUniqueInput: UserWhereUniqueInput
) => {
	if (await db.exists.User(userWhereUniqueInput)) {
		await db.mutation.deleteUser({ where: userWhereUniqueInput });
	}
};
