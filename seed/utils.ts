import { GraphQLFormattedError } from 'graphql';

export const logGraphqlError = (errors: GraphQLFormattedError[]) => {
	errors.forEach(xs => {
		console.log(` - ${xs.message}`);
	});
};
