import { shield } from 'graphql-shield';
import { isEmpty } from 'lodash';
import { fileLoader } from 'merge-graphql-schemas';
import { join } from 'path';

const permissionsArray = fileLoader(join(__dirname, './**/*.permissions.*')) as any[];

const mergedPermissions = permissionsArray.reduce((prev, current) => {
	return {
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

if (isEmpty(mergedPermissions.Query)) {
	delete mergedPermissions.Query;
}
if (isEmpty(mergedPermissions.Mutation)) {
	delete mergedPermissions.Mutation;
}
if (isEmpty(mergedPermissions.Subscription)) {
	delete mergedPermissions.Subscription;
}
export const permissions = shield(mergedPermissions);
