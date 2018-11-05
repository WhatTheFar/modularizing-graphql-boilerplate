import { UserWhereUniqueInput } from '@src/generated/prisma';
import { deleteTestUserIfExists, requestGql } from '@src/test-utils';
import { createTestUserIfNotExist, mockUserArgs } from '@src/test-utils';
import * as _ from 'lodash';
import { ValidationError } from 'yup';
import { MutationResolvers } from './../generated/graphqlgen';
import ArgsSignup = MutationResolvers.ArgsSignup;
import ArgsLogin = MutationResolvers.ArgsLogin;
import { loginGql, signupGql } from './auth.interfaces';
import { signupValidationSchema } from './auth.validation';

const email = 'auth@gmail.com';
const password = 'password123';
const userWhereUniqueInput: UserWhereUniqueInput = {
	email
};
const argsSignup: ArgsSignup = {
	...mockUserArgs,
	email,
	password
};
const argsLogin: ArgsLogin = {
	email,
	password
};

describe('signup validation', () => {
	test('should valid', async () => {
		expect.assertions(1);

		expect(await signupValidationSchema.isValid(argsSignup)).toBeTruthy();
	});

	test('missing args should be invalid', async () => {
		expect.assertions(2);
		const args = {
			...argsSignup,
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
				...argsSignup,
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

		await requestGql(signupGql, argsSignup).expect(res => {
			expect(res.body).toHaveProperty('data.signup.payload.token');
		});
	});
});

describe('login resolver', () => {
	beforeEach(async () => {
		createTestUserIfNotExist(argsSignup);
	});

	test('should return token', async () => {
		expect.assertions(1);

		await requestGql(loginGql, argsLogin).expect(res => {
			expect(res.body).toHaveProperty('data.login.payload.token');
		});
	});
});
