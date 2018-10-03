# Modularized GraphQL Boilerplate with Testing

An all-in-one modularized GraphQL server boilerplate

## Getting started

### Configuration

Create a `.env` file in the root directory of your project. Add
environment-specific variables on new lines in the form of `NAME=VALUE`.

See `.env.example` for example.

### Clean project

To clean the project run following command(s).

```sh
bash scripts/clean-local.sh
```

**Note:** Recommended for the first run.

### Run the project

1. (Optional) Clean project, follow [Clean Project](#clean-project) topic above. (Recommended if you run for the first time).
2. Run command
   ```sh
   bash scripts/run-local.sh
   ```
3. (Optional) Start [GraphQL Playground](https://github.com/prisma/graphql-playground)
   ```sh
   bash scripts/graphql-playground.sh
   ```
   **Note:** Make sure your machine has GraphQL Playground installed. Otherwise, download it from [Releases](https://github.com/prisma/graphql-playground/releases) or [install via Homebrew](https://github.com/prisma/graphql-playground#installation).

## Testing

### Run the test

1. (Optional) Make sure you have run the project once.
2. (Optional) To clear running docker container, Run command
   ```sh
   bash scripts/clear-container.sh
   ```
3. Run command
    ```sh
    bash scripts/run-test.sh
    # OR
    bash scripts/run-watch-test.sh # To run test in watch mode
    ```

## Build & Deploy

```sh
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --force-rm
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```
## Contributing

We are using angular [commit message guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines), make sure you are following those rules.

Last but not least, feel free to make discussions and open a pull request.
