import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { join } from 'path';

const typesArray = fileLoader(join(__dirname, './models/**/*.graphql'));

const typeDefs = mergeTypes(typesArray, { all: true });

const generatedDir = join(__dirname, 'generated');

if (!existsSync(generatedDir)) {
	mkdirSync(generatedDir);
}
writeFileSync(join(generatedDir, 'datamodel.graphql'), typeDefs);
