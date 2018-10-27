import * as moduleAlias from 'module-alias';
import { AddressInfo } from 'net';
import { join } from 'path';

moduleAlias.addAliases({
	'@root': join(__dirname, '..'),
	'@src': __dirname
});
moduleAlias();

import { server } from './server';

server.listen(process.env.PORT || 4000, () => {
	const { port } = server.address() as AddressInfo;
	console.log(`Server is running on http://localhost:${port}`);
});
