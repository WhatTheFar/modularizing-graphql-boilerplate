import { mergeResolvers } from '@src/resolvers';
import { shield } from 'graphql-shield';
import { fileLoader } from 'merge-graphql-schemas';
import { join } from 'path';

const permissionsArray = fileLoader(join(__dirname, './**/*.permissions.*')) as any[];

const mergedPermissions = mergeResolvers(permissionsArray);
export const permissions = shield(mergedPermissions);
