import { request } from 'graphql-request';
import { AddressInfo, Server } from 'net';
import { promisify } from 'util';
import { startServer } from './../server';

let app: Server = null;
let getHost = () => '';

beforeAll(async () => {
	app = await startServer();
	const { port } = app.address() as AddressInfo;
	getHost = () => `http://localhost:${port}`;
});

afterAll(async () => {
	if (app) {
		await promisify(app.close).call(app);
	}
});

test('ping', async () => {
	expect.assertions(1);
	const response = await request(
		getHost(),
		`
        query {
            ping
        }
        `
	);
	expect(response).toEqual({ ping: 'pong' });
});
