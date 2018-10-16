import { deleteTestUserIfExists, requestGql } from '../test-utils';
import { UserWhereUniqueInput } from './../generated/prisma';
import { createTestUserIfNotExist, mockUserArgs } from './../test-utils';
import { ILoginArgs, ISignupArgs } from './auth.resolvers';

const email = 'auth@gmail.com';
const password = 'password123';
const userWhereUniqueInput: UserWhereUniqueInput = {
	email
};
const signupArgs: ISignupArgs = {
	...mockUserArgs,
	email,
	password
};
const loginArgs: ILoginArgs = {
	email,
	password
};

export const signupGql = `
	mutation signup($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
		signup (
			email: $email
			password: $password
			firstName: $firstName
			lastName: $lastName
		) {
			payload {
				token
			}
		}
	}
`;

export const loginGql = `
	mutation login($email: String!, $password: String!) {
		login (
			email: $email
			password: $password
		) {
			payload {
				token
			}
		}
	}
`;

describe('signup', () => {
	beforeEach(async () => {
		await deleteTestUserIfExists(userWhereUniqueInput);
	});

	test('should return token', async () => {
		expect.assertions(1);

		await requestGql(signupGql, signupArgs).expect(res => {
			expect(res.body).toHaveProperty('data.signup.payload.token');
		});
	});
});

describe('login', () => {
	beforeEach(async () => {
		createTestUserIfNotExist(signupArgs);
	});

	test('should return token', async () => {
		expect.assertions(1);

		await requestGql(loginGql, loginArgs).expect(res => {
			expect(res.body).toHaveProperty('data.login.payload.token');
		});
	});
});
