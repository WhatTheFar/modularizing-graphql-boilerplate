import { requestGql } from '../test-utils';
import { db } from './../server';

let token: string;

const email = 'ping@gmail.com';
const signupGql = `
mutation {
	signup(
		email: "${email}"
		password: "password123"
		firstName: "John"
		lastName: "Doe"
	) {
		token
	}
  }
`;

beforeAll(async () => {
	try {
		if (await db.exists.User({ email })) {
			await db.mutation.deleteUser({ where: { email } });
		}
	} catch (error) {
		// do nothing
	}
	const res = await requestGql(signupGql);
	token = `Bearer ${res.body.data.signup.token}`;
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
