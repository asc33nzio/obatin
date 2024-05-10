FROM node:slim

ENV NODE_ENV production

WORKDIR /express-docker

COPY . .

RUN npm install

CMD [ "node", "server.js" ]

EXPOSE 8081