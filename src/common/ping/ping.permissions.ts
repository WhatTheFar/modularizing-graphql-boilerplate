import { isAuthenticated } from '@src/auth/auth.rules';
import { not } from 'graphql-shield';

const pingPermissions = {
	Query: {
		ping: not(isAuthenticated),
		pingAuthenticated: isAuthenticated
	}
};

export default pingPermissions;
