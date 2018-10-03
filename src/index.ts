import { AddressInfo } from 'net';
import { startServer } from './server';

startServer().then(app => {
	const { port } = app.address() as AddressInfo;
	console.log(`Server is running on http://localhost:${port}`);
});
