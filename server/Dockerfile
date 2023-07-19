FROM node:18.16

WORKDIR /usr/text-me/server

COPY package*.json ./
RUN yarn

COPY prisma ./prisma/
COPY .env ./
RUN npx prisma generate
RUN npx prisma migrate dev

COPY ./tsconfig.json ./
RUN yarn build

COPY . . 

EXPOSE 3333

CMD ["yarn", "start:prod"]