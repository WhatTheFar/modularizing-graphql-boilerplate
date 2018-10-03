FROM node:10-alpine

# Location of source code
ENV PROJECT_ROOT /opt/app
RUN mkdir -p $PROJECT_ROOT
WORKDIR $PROJECT_ROOT

# Copying src
COPY ./src ./src
COPY ./tsconfig.json .

# Copying scripts
COPY ./scripts ./scripts
COPY ./scripts/wait-for.sh /


#  Copying prima
COPY ./prisma ./prisma
COPY ./.graphqlconfig.yml .

# Copying requirements
COPY ./package.json .
COPY ./yarn.lock .
# Install requirements
RUN yarn

# Build dist
RUN yarn build

CMD yarn start:prod