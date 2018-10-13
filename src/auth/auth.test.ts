import { requestGql } from '../test-utils';
import { db } from './../server';

const email = 'auth@gmail.com';
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

describe('signup', () => {
	beforeEach(async () => {
		try {
			if (await db.exists.User({ email })) {
				await db.mutation.deleteUser({ where: { email } });
			}
		} catch (error) {
			// do nothing
		}
	});

	test('should return token', async () => {
		expect.assertions(1);

		await requestGql(signupGql).expect(res => {
			expect(res.body).toHaveProperty('data.signup.token');
		});
	});
});

describe('login', () => {
	beforeEach(async () => {
		if (!(await db.exists.User({ email }))) {
			await requestGql(signupGql);
		}
	});

	test('should return token', async () => {
		expect.assertions(1);
		const gql = `
			mutation {
				login (
					email: "${email}"
		  			password: "password123"
				) {
		  			token
				}
	  		}
		`;

		await requestGql(gql).expect(res => {
			expect(res.body).toHaveProperty('data.login.token');
		});
	});
});
