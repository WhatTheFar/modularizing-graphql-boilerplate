import * as yup from 'yup';

const isEmail = yup
	.string()
	.trim()
	.required()
	.email();

export const signupValidationSchema = yup.object().shape({
	email: isEmail,
	password: yup
		.string()
		.trim()
		.min(8)
		.max(20),
	firstName: yup
		.string()
		.trim()
		.required(),
	lastName: yup
		.string()
		.trim()
		.required()
});

export const loginValidationSchema = yup.object().shape({
	email: isEmail
});
