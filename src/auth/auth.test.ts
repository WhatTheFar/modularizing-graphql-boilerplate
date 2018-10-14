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

describe('signup', () => {
	beforeEach(async () => {
		await deleteTestUserIfExists(userWhereUniqueInput);
	});

	test('should return token', async () => {
		expect.assertions(1);

		const signupGql = `
			mutation signup($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
				signup (
					email: $email
					password: $password
					firstName: $firstName
					lastName: $lastName
				) {
					token
				}
		 	}
		`;
		await requestGql(signupGql, signupArgs).expect(res => {
			expect(res.body).toHaveProperty('data.signup.token');
		});
	});
});

describe('login', () => {
	beforeEach(async () => {
		createTestUserIfNotExist(signupArgs);
	});

	test('should return token', async () => {
		expect.assertions(1);
		const gql = `
			mutation login($email: String!, $password: String!) {
				login (
					email: $email
		  			password: $password
				) {
		  			token
				}
	  		}
		`;

		await requestGql(gql, loginArgs).expect(res => {
			expect(res.body).toHaveProperty('data.login.token');
		});
	});
});
