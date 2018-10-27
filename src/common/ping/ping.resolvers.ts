const pingResovler = {
	Query: {
		async ping() {
			return 'pong';
		},
		async pingAuthenticated() {
			return 'pong';
		}
	}
};

export default pingResovler;
