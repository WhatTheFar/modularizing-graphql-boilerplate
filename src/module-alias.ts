import * as moduleAlias from 'module-alias';
import { join } from 'path';

moduleAlias.addAliases({
	'@root': join(__dirname, '..'),
	'@src': __dirname
});
moduleAlias();
