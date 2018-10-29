export interface ISignupArgs {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface ILoginArgs {
	email: string;
	password: string;
}

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
