import { Prisma } from './generated/prisma';
// tslint:disable:interface-name

export interface Context {
	db: Prisma;
	request: any;
}

export interface TokenPayload {
	userId: string;
}

export interface FieldValidationError {
	field: string;
	errors: string[];
}

export interface MutationValidationError {
	message: string;
	details: FieldValidationError[];
}
