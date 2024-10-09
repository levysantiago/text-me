#!/bin/sh
cd usr/text-me/server
yarn --frozen-lockfile
npx prisma migrate reset
npx prisma db seed
yarn build
yarn start:prod