import { Prisma, User } from '@src/generated/prisma';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { MutationResolvers } from './../generated/graphqlgen';
import ArgsSignup = MutationResolvers.ArgsSignup;

export const generateToken = (user: User): string =>
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
