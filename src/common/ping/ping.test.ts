import { MutationResolvers } from '@src/generated/graphqlgen';
import ArgsSignup = MutationResolvers.ArgsSignup;
import { graphqlServer } from '@src/server';
import { getUserBearerToken, mockUserArgs, requestGql } from '@src/test-utils';
import { createTestUserIfNotExist } from '@src/test-utils';
import { graphql } from 'graphql';
import gql from 'graphql-tag';

let token: string;

const email = 'ping@gmail.com';
const signupArgs: ArgsSignup = {
	...mockUserArgs,
	email
};

beforeAll(async () => {
	await createTestUserIfNotExist(signupArgs);
	token = await getUserBearerToken({ email });
});

test('ping', async () => {
	expect.assertions(1);
	const tag = gql`
		query {
			ping
		}
	`;

	await requestGql(tag).expect(res => {
		expect(res.body.data).toEqual({ ping: 'pong' });
	});
});

test('pingAuthenticated', async () => {
	expect.assertions(1);
	const tag = gql`
		query {
			pingAuthenticated
		}
	`;

	await requestGql(tag)
		.set('Authorization', token)
		.expect(res => {
			expect(res.body.data).toEqual({ pingAuthenticated: 'pong' });
		});
});

test('pingAuthenticated without supertest', async () => {
	expect.assertions(1);
	const tag = `
		query {
			pingAuthenticated
		}
	`;

	const response = await graphql(graphqlServer.executableSchema, tag, null, {
		request: { headers: { authorization: token } },
		db: { exists: { User: jest.fn().mockReturnValue(true) } }
	});

	expect(response.data).toEqual({ pingAuthenticated: 'pong' });
});
