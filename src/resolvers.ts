import { isEmpty, omitBy } from 'lodash';
import { fileLoader } from 'merge-graphql-schemas';
import { join } from 'path';

export const mergeResolvers = (mergingResolvers: any[]) => {
	const reducedResolver = mergingResolvers.reduce((prev, current) => {
		return {
			...current,
			Query: {
				...prev.Query,
				...current.Query
			},
			Mutation: {
				...prev.Mutation,
				...current.Mutation
			},
			Subscription: {
				...prev.Subscription,
				...current.Subscription
			}
		};
	}, {});

	return omitBy(reducedResolver, isEmpty);
};

const resolversArray = fileLoader(join(__dirname, './**/*.resolvers.*'));

export const resolvers = mergeResolvers(resolversArray);
