import { ISignupArgs } from '../../src/auth/auth.resolvers';
import { requestGql } from '../../src/test-utils';
import { signupGql } from './../../src/auth/auth.resolvers';
import { logGraphqlError } from './../utils';

export const seedUserArgs: ISignupArgs = {
	email: 'jakpat.m@gmail.com',
	password: 'password123',
	firstName: 'John',
	lastName: 'Doe'
};

export const initAuth = async () => {
	const res = await requestGql(signupGql, seedUserArgs);

	if (res.body.errors) {
		console.log('initAuth error');
		logGraphqlError(res.body.errors);
	}
};
