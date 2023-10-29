FROM node:18.13-alpine as build 
WORKDIR /usr/src/app
COPY package*.json ./
COPY yarn.lock ./
COPY src/infra/data/prisma ./prisma
RUN yarn install --frozen-lockfile
RUN npx prisma generate
COPY . .
RUN yarn build

FROM node:18.13-alpine as publish
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./dist/prisma
EXPOSE 3000

CMD [ "node", "dist/src/main.js" ]