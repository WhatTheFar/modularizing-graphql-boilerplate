import { QueryResolvers } from '@root/src/generated/graphqlgen';

const pingDate: QueryResolvers.PingDateResolver = async (parent, args, ctx) => {
	if (args.date) {
		return new Date(args.date) as any;
	}
	// There is no scalar mapping in `graphqlgen`
	// so we need to cast as any for work around.
	return new Date() as any;
};

const pingResovler = {
	Query: {
		async ping() {
			return 'pong';
		},
		async pingAuthenticated() {
			return 'pong';
		},
		pingDate
	}
};

export default pingResovler;
