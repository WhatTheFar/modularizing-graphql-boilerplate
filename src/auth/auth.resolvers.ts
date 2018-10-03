import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AuthError, getUser } from '../utils';

export const authResolver = {
	Query: {
		async currentUser(parent, args, ctx: Context, info) {
			return await getUser(ctx, info);
		}
	},

	Mutation: {
		async signup(parent, args, ctx: Context, info) {
			const password = await bcrypt.hash(args.password, 10);
			const user = await ctx.db.mutation.createUser({
				data: {
					...args,
					password,
					roles: {
						set: 'USER'
					}
				}
			});

			return {
				token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
				user
			};
		},

		async login(parent, args, ctx: Context, info) {
			const user = await ctx.db.query.user({ where: { email: args.email } });
			const valid = await bcrypt.compare(args.password, user ? user.password : '');

			if (!valid || !user) {
				throw new AuthError();
			}

			return {
				token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
				user
			};
		}
	},

	AuthPayload: {
		async user(parent, args, context, info) {
			return context.db.query.user({ where: { id: parent.user.id } }, info);
		}
	}
};

export default authResolver;
