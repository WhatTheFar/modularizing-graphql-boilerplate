import './module-alias';

import { AddressInfo } from 'net';
import { server } from './server';

server.listen(process.env.PORT || 4000, () => {
	const { port } = server.address() as AddressInfo;
	console.log(`Server is running on http://localhost:${port}`);
});
