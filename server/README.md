# TextMe Server

This is the server side of TextMe application. It was build in TypeScript and NestJS, and also using the following tools:

- Socket.io: Internally used by NestJS.
- Zod: To validate data.

OBS: For now the server is using cache to store the database data, but the goal is to use Prisma to manage database storages and, as it is a small project yet, it's going to use SQLite as database.


## Installation

```bash
$ yarn
```
or 

```bash
$ npm install
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
