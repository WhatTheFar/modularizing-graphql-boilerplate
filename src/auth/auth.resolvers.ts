import { Prisma, User } from '@src/generated/prisma';
import { AuthError, getUser } from '@src/utils';
import * as bcrypt from 'bcryptjs';
import { GraphQLResolveInfo } from 'graphql';
import * as jwt from 'jsonwebtoken';
import { MutationResolvers, QueryResolvers } from './../generated/graphqlgen';
import ArgsSignup = MutationResolvers.ArgsSignup;
import { loginValidationSchema, signupValidationSchema } from './auth.validation';

export const generateToken = (user: User) =>
	jwt.sign({ userId: user.id }, process.env.APP_SECRET || 'jwt_secret');

export const createUserToPrisma = async (prisma: Prisma, args: ArgsSignup) => {
	const password = await bcrypt.hash(args.password, 10);
	const user = await prisma.mutation.createUser({
		data: {
			...args,
			password
		}
	});
	return user;
};

const currentUserResolver: QueryResolvers.CurrentUserResolver = async (
	parent,
	args,
	ctx,
	info
) => {
	return await getUser(ctx, info);
};

const signupResolver: MutationResolvers.SignupResolver = async (
	parent,
	args,
	ctx,
	info
) => {
	const user = await createUserToPrisma(ctx.db, args);
	return {
		payload: {
			token: generateToken(user),
			user
		}
	};
};

const loginResolver: MutationResolvers.LoginResolver = async (
	parent,
	args,
	ctx,
	info
) => {
	const user = await ctx.db.query.user({ where: { email: args.email } });
	const valid = await bcrypt.compare(args.password, user ? user.password : '');

	if (!valid || !user) {
		throw new AuthError();
	}

	return {
		payload: {
			token: generateToken(user),
			user
		}
	};
};

export const authResolver = {
	Query: {
		currentUser: currentUserResolver
	},

	Mutation: {
		signup: {
			validationSchema: signupValidationSchema,
			resolve: signupResolver
		},

		login: {
			validationSchema: loginValidationSchema,
			resolve: loginResolver
		}
	},

	AuthPayload: {
		async user(parent, args, context, info: GraphQLResolveInfo) {
			if (parent.user.id) {
				const user = await context.db.query.user(
					{ where: { id: parent.user.id } },
					info
				);
				return user || parent.user;
			}
			return parent.user;
		}
	}
};

export default authResolver;
