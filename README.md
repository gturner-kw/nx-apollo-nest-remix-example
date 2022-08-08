

# Nx Apollo Nest Remix Example

This project was generated using [Nx](https://nx.dev).

![NX Framework](https://raw.githubusercontent.com/nrwl/nx/master/images/nx.png)

This project was generated using the following steps:

## Install Nx CLI

```sh
npm install -g nx
```

## Create new workspace for NestJs

```sh
❯ npx create-nx-workspace nx-apollo-nest-remix-example
✔ What to create in the new workspace · nest
✔ Application name                    · nest-api
✔ Set up distributed caching using Nx Cloud (It's free and doesn't require registration.) · No

 >  NX   Nx is creating your v14.5.4 workspace.

   To make sure the command works reliably in all environments, and that the preset is applied correctly,
   Nx will run "npm install" several times. Please wait.

✔ Installing dependencies with npm
⠦ Creating your workspace
```

Install graphql modules:

```sh
npm install @nestjs/graphql @nestjs/apollo apollo-server-express graphql-tools graphql
```

Create graphql schema types, etc: [apps/nest-api/src/app/schema.graphql](apps/nest-api/src/app/schema.graphql)

Now, let's connect graphql to data: [apps/nest-api/src/app/set.resolver.ts](apps/nest-api/src/app/set.resolver.ts)

Lastly, import graphql into Nest: [apps/nest-api/src/app/app.module.ts](apps/nest-api/src/app/app.module.ts)

Now, start the api:

```sh
nx start nest-api
```

Check out the graphql playground: <http://localhost:3333/graphql>

Try out a query and mutation:

```gql
query allSets {
  allSets{
    id,
    name,
    numParts
  }
}

mutation addSet {
  addSet(name: "My New Set", numParts: 200, year: "2020") {
    id
 }
}
```

## Prep Workspace for Remix

```sh
npm i -D @nrwl/remix
npx nx g @nrwl/remix:setup
```

## Create Data-Access Library

Let's create a library to share our graphql schema types.

```sh
nx g @nrwl/remix:library data-access
npm i @apollo/react-hooks graphql
npm i -D @graphql-codegen/cli @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
```

Create some data operations: [libs/data-access/src/lib/graphql/operations.graphql](libs/data-access/src/lib/graphql/operations.graphql)

Setup codegen: [libs/data-access/codegen.yml](libs/data-access/codegen.yml)

Setup action to generate code by adding the following `codegen` target to [libs/data-access/project.json](libs/data-access/project.json):

```json
{
  ...
  "targets": {
    ...
    "codegen": {
      "executor": "nx:run-commands",
      "options": {
        "commands": [
          {
            "command": "npx graphql-codegen --config libs/data-access/codegen.yml"
          }
        ]
      }
    }
  }
}
```

Now, run the codegen command:

```sh
nx codegen data-access
```
