import { not } from 'graphql-shield';
import { isAuthenticated } from './../auth/auth.rules';

const pingPermissions = {
	Query: {
		ping: not(isAuthenticated),
		pingAuthenticated: isAuthenticated
	}
};

export default pingPermissions;
