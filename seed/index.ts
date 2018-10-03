import { initUser } from './user';

export const initSeed = async () => {
	const host = 'http://localhost:4000';

	try {
		await initUser(host);
	} catch (error) {
		console.log('initUser failed');
		if (error.response.errors) {
			error.response.errors.forEach(xs => {
				console.log(` - ${xs.message}`);
			});
		}
	}
};

initSeed();
