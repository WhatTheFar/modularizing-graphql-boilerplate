import * as _ from 'lodash';
import { ValidationError } from 'yup';
import { deleteTestUserIfExists, requestGql } from '../test-utils';
import { UserWhereUniqueInput } from './../generated/prisma';
import { createTestUserIfNotExist, mockUserArgs } from './../test-utils';
import { ILoginArgs, ISignupArgs } from './auth.interfaces';
import { signupValidationSchema } from './auth.validation';

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

describe('signup validation', () => {
	test('should valid', async () => {
		expect.assertions(1);

		expect(await signupValidationSchema.isValid(signupArgs)).toBeTruthy();
	});

	test('missing args should be invalid', async () => {
		expect.assertions(2);
		const args = {
			...signupArgs,
			email: '',
			firstName: '',
			lastName: ''
		};

		// Should be invalid
		expect(await signupValidationSchema.isValid(args)).toBeFalsy();

		try {
			// In the case of aggregate errors,
			// inner is an array of ValidationErrors throw earlier in the validation chain.
			// When the abortEarly option is false this is where you can inspect each error thrown,
			// alternatively errors will have all the of the messages from each inner error.
			await signupValidationSchema.validate(args, { abortEarly: false });
		} catch (error) {
			if (error instanceof ValidationError) {
				// NOTE: if 'abortEarly' is false, the errors will be in 'inner'
				expect(_.map(error.inner, 'path')).toEqual(
					// Expecting 3 ValidationError
					expect.arrayContaining(['email', 'firstName', 'lastName'])
				);
			}
		}
	});

	test('invalid email should be rejected', async () => {
		expect.assertions(1);

		await expect(
			signupValidationSchema.validate({
				...signupArgs,
				email: 'this_is_not_an_email'
			})
		).rejects.toHaveProperty('path', 'email');
	});
});

describe('signup resolver', () => {
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

describe('login resolver', () => {
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
