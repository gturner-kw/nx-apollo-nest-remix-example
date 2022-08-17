# Nx Example Project using Apollo, Remix, and NestJS

This is an example project using Nx to manage Remix and NestJS servers connected by Apollo GraphQL.

Supported by a Cypress e2e test.

This project was generated using [Nx](https://nx.dev).

![NX Framework](https://raw.githubusercontent.com/nrwl/nx/master/images/nx.png)

And includes the following technologies:

* [Apollo](https://apollographql.com/)
* [Remix](https://remix.run)
* [NestJS](https://nestjs.com/)
* [Cypress](https://cypress.io/)

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

Now, start the api (in watch mode):

```sh
nx serve nest-api
```

Check out the graphql playground: <http://localhost:4200/graphql>

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

Then, build it to deploy to node_modules:

```sh
nx build data-access
```

## Create Remix App

Generate the app:

```sh
npx nx g @nrwl/remix:app remix-bff
```

Now, let's create a apollo client to connect to the api.

```sh
npm i @apollo/client
```

OK, we need to create the apollo client and point it to our api server. Yeah, don't hardcode this url. Add this file: [apps/remix-bff/app/context/apollo.tsx](apps/remix-bff/app/context/apollo.tsx)

Since both the frontend and backend will be using this code, note how we have the ability to specify ssrMode. Also, note we need to define a cache on the browser side: window.__INITIAL_STATE__

Oh yeah, let's define window.__INITIAL_STATE__ for typescript. See [apps/remix-bff/remix.env.d.ts](apps/remix-bff/remix.env.d.ts).

OK, now let's initialize window.__INITIAL_STATE__ when rendering our html. See [apps/remix-bff/app/root.tsx](apps/remix-bff/app/root.tsx).

Then, connect it to our remix backend. See [apps/remix-bff/app/entry.server.tsx](apps/remix-bff/app/entry.server.tsx). Note how we're wrapping the server code in the apollo client and using the ssr `getDataFromTree`.

Next, connect it to our remix frontend. See [apps/remix-bff/app/entry.client.tsx](apps/remix-bff/app/entry.client.tsx). Again, note how we're wrapping the browser code in the apollo client.

Finally, let's merge in our base tsconfig into the one created for remix. See [apps/remix-bff/tsconfig.json](apps/remix-bff/tsconfig.json).

OK, we have enough to launch the server (in watch mode):

```sh
nx dev remix-bff
```

## Showing Data

Let's build some pages interfacing with api with help from the data-access library.

First, let typescript be aware of these local paths by editing [apps/remix-bff/tsconfig.json](apps/remix-bff/tsconfig.json) as follows:

```json
{
  ...
  "paths": {
    ...
    "@nx-apollo-next-remix-example/data-access": [
       "../../libs/data-access/src/index.ts"
    ]
  }
}
```

Then, let's connect the data-access library to remix's watch by adding the following to [apps/remix-bff/remix.config.js](apps/remix-bff/remix.config.js):

```js
module.exports = {
  ...
  watchPaths: ['../../libs']
}
```

Now, let's create a route that interacts with the nest-api on the backend. See [apps/remix-bff/app/routes/ssr.tsx](apps/remix-bff/app/routes/ssr.tsx).

Then, let's create a route that interacts with the nest api on the frontend. See [apps/remix-bff/app/routes/csr.tsx](apps/remix-bff/app/routes/csr.tsx).

Test these pages out. Check out the network tab and watch how the data is fetched. Note that there's also caching happening, so don't be surprised to see the browser not hit the api on a refresh.

## Create E2E Test App

Generate the e2e app:

```sh
npm i -D cypress start-server-and-test
npx nx generate @nrwl/cypress:cypress-project remix-e2e --project=remix-bff
```

Now, remove the e2e target in [apps/remix-e2e/project.json](apps/remix-e2e/project.json). It won't work for remix, so we'll create our own scripts using start-server-and-test. See [apps/remix-e2e/package.json](apps/remix-e2e/package.json).

Customize the baseUrl to remix. See [apps/remix-e2e/cypress.config.ts](apps/remix-e2e/cypress.config.ts).

Next, make some tests! We'll just write a simple one: [apps/remix-e2e/src/e2e/app.cy.ts](apps/remix-e2e/src/e2e/app.cy.ts).

Now, let's run it.

```sh
nx e2e remix-e2e
```

It should create a video output at `/dist/cypress/apps/remix-e2e/videos/app.cy.ts.mp4`.

## Create Remix Executor

Create lib to ...

```sh
npm i -D @nrwl/nx-plugin
npx nx generate @nrwl/nx-plugin:plugin workspace-extensions --minimal
npx nx generate @nrwl/nx-plugin:executor generate-remix-package-json --project=workspace-extensions --description='Executor to generate Remix package.json'
```

Now, we'll create the executor to generate the Remix package.json. See [libs/workspace-extensions/src/executors/generate-remix-package-json/executor.ts](libs/workspace-extensions/src/executors/generate-remix-package-json/executor.ts).

## Dockerize API

Now, let's build docker images for these apps.

First, we need to add the graphql assets to the project output. See the 'build' target in [apps/nest-api/project.json](apps/nest-api/project.json).

Also, let's create a helper command to build the app and the docker image. See the 'docker-build' target in [apps/nest-api/project.json](apps/nest-api/project.json).

Now, build the api.

```sh
nx docker-build nest-api
```

 Note that this command accepts argument overrides. So to tag the image with a version of `0.0.1`, use the following:

 ```sh
 nx docker-build nest-api --tag nest-api:0.0.1
 ```

Finally, let's run the docker image:

```sh
docker run -it --rm -p 4200:4200 --name nest-api nest-api
```

## TODO

Here's the stuff that isn't working:

* dockerize remix - nx doesn't generate a package.json file in dist - <https://github.com/nrwl/nx-labs/issues/31>
