FROM node:17.8

WORKDIR /app

COPY ./dist/apps/nest-api .

ENV PORT=4200
EXPOSE ${PORT}

RUN npm install --production

CMD node ./main.js
