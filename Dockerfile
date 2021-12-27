FROM node:14.16.0-alpine3.10
WORKDIR /app
RUN apk add --no-cache bash vim
# RUN npm install -g nodemon
RUN npm install -g typescript
RUN npm install -g ts-node

COPY package.json yarn.lock ./
