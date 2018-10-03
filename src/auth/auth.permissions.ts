import { isAuthenticated } from './auth.rules';

const authPermissions = {
	Query: {
		currentUser: isAuthenticated
	}
};

export default authPermissions;
