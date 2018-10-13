import * as request from 'supertest';
import { graphqlServer, server } from './server';

export interface IHeaders {
	[key: string]: string;
}

export interface IVariables {
	[key: string]: any;
}

export const requestGql = (query: string, variables?: IVariables) => {
	const body = JSON.stringify({
		query,
		variables
	});
	return request(server)
		.post(graphqlServer.options.endpoint || '/')
		.set('Content-Type', 'application/json')
		.send(body);
};
