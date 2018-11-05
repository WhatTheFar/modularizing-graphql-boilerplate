import { User } from '@src/generated/prisma';
import { MutationValidationError } from '@src/types';
// tslint:disable:interface-name

export interface AuthPayloadWithError {
	payload?: AuthPayload;
	error?: MutationValidationError;
}

export interface AuthPayload {
	token: string;
	user: User;
}
