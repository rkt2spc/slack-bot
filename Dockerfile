FROM node:8-alpine

# Labels
LABEL maintainer=nmtuan@fossil.com

# Install bash
RUN apk update && apk add bash

# Build steps: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
WORKDIR /src
ADD package.json /src/
RUN npm install
ADD . /src/

# Application start cmd
CMD ["npm","start"]
