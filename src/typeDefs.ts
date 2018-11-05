import { readFileSync, writeFileSync } from 'fs';
import { FieldValidationError, MutationValidationError } from 'graphql-yup-middleware';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { join } from 'path';

export const generateTypeDefs = () => {
	const typesArray = fileLoader(join(__dirname, './**/!(generated)/*.graphql'));

	const typeDefs = `
# import * from "prisma.graphql"

scalar Upload

${FieldValidationError}
${MutationValidationError}
${mergeTypes(typesArray, { all: true })}
`;

	writeFileSync(join(__dirname, 'generated', 'schema.graphql'), typeDefs);
};

export const extendedTypeDefs: string = readFileSync(
	join(__dirname, './common/extend-type/extend-type.graphql')
).toString();
