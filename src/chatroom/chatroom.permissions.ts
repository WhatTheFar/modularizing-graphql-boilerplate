import { isAuthenticated } from '../auth/auth.rules';

const chatroomPermission = {
	Query: {
		chatroom: isAuthenticated
	},
	Mutation: {
		sendMessage: isAuthenticated
	}
};

export default chatroomPermission;
