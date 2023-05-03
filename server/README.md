# TextMe Server

This is the server side of TextMe application. It was build in TypeScript and NestJS, and also using the following technologies:

- Socket.io: Internally used by NestJS.
- Zod: To validate data.
- Prisma: CRM to connect to Database
- SQLite: Local Database


## Installation

```bash
$ yarn
```
or 

```bash
$ npm install
```

## Executing migrations

```bash
npx prisma migrate dev
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
