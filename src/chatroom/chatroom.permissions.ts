import { isAuthenticated } from '../auth/auth.rules';

const chatroomPermission = {
	Query: {
		chatroom: isAuthenticated
	},
	Mutation: {
		sendMessage: isAuthenticated,
		joinChatroom: isAuthenticated,
		createChatroom: isAuthenticated
	}
};

export default chatroomPermission;
