import * as bcrypt from 'bcryptjs';
import { GraphQLResolveInfo } from 'graphql';
import * as jwt from 'jsonwebtoken';
import { AuthError, getUser } from '../utils';
import { Prisma, User } from './../generated/prisma';

export const generateToken = (user: User) =>
	jwt.sign({ userId: user.id }, process.env.APP_SECRET || 'jwt_secret');

export const createUserToPrisma = async (prisma: Prisma, args: ISignupArgs) => {
	const password = await bcrypt.hash(args.password, 10);
	const user = await prisma.mutation.createUser({
		data: {
			...args,
			password
		}
	});
	return user;
};

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

export const authResolver = {
	Query: {
		async currentUser(parent, args, ctx: Context, info) {
			return await getUser(ctx, info);
		}
	},

	Mutation: {
		async signup(parent, args: ISignupArgs, ctx: Context, info: GraphQLResolveInfo) {
			const user = await createUserToPrisma(ctx.db, args);

			return {
				token: generateToken(user),
				user
			};
		},

		async login(parent, args: ILoginArgs, ctx: Context, info) {
			const user = await ctx.db.query.user({ where: { email: args.email } });
			const valid = await bcrypt.compare(args.password, user ? user.password : '');

			if (!valid || !user) {
				throw new AuthError();
			}

			return {
				token: generateToken(user),
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
