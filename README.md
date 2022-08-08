

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
