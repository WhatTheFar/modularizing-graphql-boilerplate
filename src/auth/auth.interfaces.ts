import gql from 'graphql-tag';

export const signupGql = gql`
	mutation signup(
		$email: String!
		$password: String!
		$firstName: String!
		$lastName: String!
	) {
		signup(
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

export const loginGql = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			payload {
				token
			}
		}
	}
`;
