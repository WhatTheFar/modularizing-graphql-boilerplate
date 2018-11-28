import { createUserToPrisma, generateToken } from '@src/auth/auth.services';
import { AuthError, getUser } from '@src/utils';
import * as bcrypt from 'bcryptjs';
import {
	AuthPayloadResolvers,
	MutationResolvers,
	QueryResolvers
} from './../generated/graphqlgen';
import { loginValidationSchema, signupValidationSchema } from './auth.validation';

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

const authPayloadResolver: AuthPayloadResolvers.Type = {
	...AuthPayloadResolvers.defaultResolvers,
	user: async (parent, args, ctx, info) => {
		if (parent.user.id) {
			const user = await ctx.db.query.user({ where: { id: parent.user.id } }, info);
			return user || parent.user;
		}
		return parent.user;
	}
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

	AuthPayload: authPayloadResolver
};

export default authResolver;
