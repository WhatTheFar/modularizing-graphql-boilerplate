import { getUserId } from '@src/utils';
import { rule } from 'graphql-shield';

// Rules
export const isAuthenticated = rule()(async (parent, args, ctx: Context, info) => {
	return await ctx.db.exists.User({ id: getUserId(ctx) });
});
