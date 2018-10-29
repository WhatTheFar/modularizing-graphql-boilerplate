# Executed by yarn
rm -rf dist
ts-node prisma/datamodel.ts
graphql codegen
ts-node scripts/generateTypeDefs.ts
tsc
echo # Copying graphql schema
mkdir -p ./dist/generated
cp ./src/generated/schema.graphql ./dist/generated/schema.graphql
cp ./src/common/extend-type/extend-type.graphql ./dist/common/extend-type/extend-type.graphql