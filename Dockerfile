FROM node:10.16.0-alpine as build

WORKDIR /opt
COPY . .
RUN yarn
RUN yarn build


FROM node:10.16.0-alpine

WORKDIR /opt/app
ENV NODE_ENV=production
CMD ["node", "build/api.js"]
LABEL MAINTAINER="Kozlov Viktor <victor@kozlov.io>" VERSION="v1.0.0"

COPY --from=build --chown=node:node /opt/package.json package.json
COPY --from=build --chown=node:node /opt/build build

RUN yarn --prod && \
    yarn cache clean

USER node
