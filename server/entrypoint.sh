#!/bin/sh
cd usr/text-me/server
yarn
npx prisma migrate reset
npx prisma db seed
yarn start:dev