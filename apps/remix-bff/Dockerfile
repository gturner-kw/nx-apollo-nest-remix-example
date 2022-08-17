### Builder image ###
FROM node:16 as builder

WORKDIR /app

# first install dev deps - they don't change often
COPY *.json ./
RUN npm ci

# now copy code and build
COPY . .
RUN npx nx build workspace-extensions --prod
RUN npx nx build remix-bff --prod

### Production image ###
FROM node:16-alpine as production

# wrap app in an init process - https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#handling-kernel-signals
RUN apk add dumb-init

# The official node image provides an unprivileged user as a security practice.
USER node

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV PORT=3000
EXPOSE ${PORT}

# copy output from builder
WORKDIR /app
COPY --chown=node:node --from=builder /app/apps/remix-bff/server.js /app/dist/apps/remix-bff/package.json ./
COPY --chown=node:node --from=builder /app/apps/remix-bff/build/ build/
COPY --chown=node:node --from=builder /app/apps/remix-bff/public/ public/

# install generated dependencies
RUN npm install

CMD ["dumb-init", "node", "server.js"]
