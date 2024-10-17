# TextMe Server

This is the server side of TextMe application. It was build in TypeScript and NestJS, and also using the following technologies:

# Index
- [TextMe Server](#textme-server)
- [Index](#index)
- [Technologies used](#technologies-used)
- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Running dependency services on Docker](#running-dependency-services-on-docker)
  - [Environment variables](#environment-variables)
  - [Executing migrations](#executing-migrations)
  - [Running the app](#running-the-app)
  - [Test](#test)
  - [Building](#building)
  - [Routes Documentation (Swagger and Postman)](#routes-documentation-swagger-and-postman)
- [Links](#links)

# Technologies used

- **NestJS:** Framework used to create the TextMe API.
- **Socket.io:** For websocket communications in the TextMe Chat.
- **Zod:** To validate requests data.
- **Prisma:** ORM to manage communication with Database
- **PostgreSQL:** Database to store users and messages data.
- **Swagger:** For HTTP routes documentation (`/docs`).
- **Postman:** For HTTP and WebSocket [routes documentation](https://levysdev.postman.co/workspace/TextMe~f2fdf013-d5e6-4438-92a2-de2d81d93202/overview).

# Getting started

## Installation

First you will need to install the dependencies:

```bash
$ yarn
```
or 

```bash
$ npm install
```

## Running dependency services on Docker

If you already have the **PostgreSQL**, **Redis** and **RabbitMQ** containers running on Docker, you can skip this section.

Before going to the next step you might need to run the script `run-services.sh` that will start the PostgreSQL container and other services. To do that, go back to the previous folder and execute this script:

```bash
cd ..
```

```bash
./run-services.sh
```

## Environment variables

Now you will need to create a `.env` file inside the server project and insert the following keys. Define a safe secret for the `JWT_SECRET` value and add the PostgreSQL database URL as `DATABASE_URL` value, example: `"postgresql://<username>:<password>@<host>:5432/<database_name>?schema=public"`, updating `<username>` by the database username, the `password` by the user password, the `<host>` by the database host and the `<database_name>` by the database name.

```text
# Auth
JWT_SECRET=

# Database
DATABASE_URL=

# Server
SERVER_PORT=3333
```

## Executing migrations

Now you have all dependencies installed, you will have to create the database structure in PostgreSQL. To do that you need to run the Prisma migrations:

```bash
npx prisma migrate dev 
```

This command will also execute the Prisma seed that will create two default users for you, Alice and Bob. Here are their credentials:

**Alice credentials:**
```text
Email: alice@gmail.com
Password: 12345678
```

**Bob credentials:**
```text
Email: bob@gmail.com
Password: 12345678
```

If you want to ignore the seed, you can run the same command using the flag `--skip-seed`: 

```bash
npx prisma migrate dev --skip-seed
```

## Running the app

Ok, now we can start the TextMe Server:

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

The server will be running at `http://localhost:3333`.

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Building

For production purposes, you must create a `.env.production` file on `server` folder, so that the docker compose file can use it as the application environment file. Create this file and update with production variable values.

`OBS:` Remember that if you are going to use docker, the database name should be the name of the database container and not the default `localhost`. For example, if the database container name is `postgresql`, this means:

```diff
// Instead of define the database url like this:
- postgresql://docker:docker@localhost:5432/<database_name>?schema=public

// You should define the database url like this:
+ postgresql://docker:docker@postgresql:5432/<database_name>?schema=public
```

Then you can run:

```bash
npm run build
```

or

```bash
yarn build
```

## Routes Documentation (Swagger and Postman)

After running the server you will be able to see the HTTP API Swagger documentation on `http://localhost:3333/docs`.

You can also read and interact with the HTTP and WebSocket routes on [Postman workspace](https://levysdev.postman.co/workspace/TextMe~f2fdf013-d5e6-4438-92a2-de2d81d93202/overview).


# Links

- [Nest.js Docs](https://docs.nestjs.com/)
- [Socket.io Docs](https://socket.io/pt-br/docs/v4/)
- [ZOD Docs](https://zod.dev/)
- [Prisma Docs](https://www.prisma.io/docs/getting-started)
- [PostgreSQL Docs](https://www.postgresql.org/)