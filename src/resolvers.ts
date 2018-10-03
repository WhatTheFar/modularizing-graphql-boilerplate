import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';
import { join } from 'path';

const resolversArray = fileLoader(join(__dirname, './**/*.resolvers.*'));
export const resolvers = mergeResolvers(resolversArray);
