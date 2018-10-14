import { getUserBearerToken, mockUserArgs, requestGql } from '../test-utils';
import { ISignupArgs } from './../auth/auth.resolvers';
import { createTestUserIfNotExist } from './../test-utils';

let token: string;

const email = 'ping@gmail.com';
const signupArgs: ISignupArgs = {
	...mockUserArgs,
	email
};

beforeAll(async () => {
	await createTestUserIfNotExist(signupArgs);
	token = await getUserBearerToken({ email });
});

test('ping', async () => {
	expect.assertions(1);
	const gql = `
	    query {
	        ping
	    }
	`;

	await requestGql(gql).expect(res => {
		expect(res.body.data).toEqual({ ping: 'pong' });
	});
});

test('pingAuthenticated', async () => {
	expect.assertions(1);
	const gql = `
	    query {
	        pingAuthenticated
	    }
	`;

	await requestGql(gql)
		.set('Authorization', token)
		.expect(res => {
			expect(res.body.data).toEqual({ pingAuthenticated: 'pong' });
		});
});
