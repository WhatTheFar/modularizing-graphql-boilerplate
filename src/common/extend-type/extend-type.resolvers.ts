const extendTypeResolver = {
	User: {
		async extendedField(parent, args, ctx: Context, info) {
			return 'extended field is working';
		}
	}
};

export default extendTypeResolver;
