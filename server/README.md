# TextMe Server

This is the server side of TextMe application. It was build in TypeScript and NestJS, and also using the following technologies:

- **NestJS:** Framework used to create the TextMe API.
- **Socket.io:** For websocket communications in the TextMe Chat.
- **Zod:** To validate requests data.
- **Prisma:** ORM to manage communication with Database
- **PostgreSQL:** Database to store users and messages data.

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

# Links

- [Nest.js Docs](https://docs.nestjs.com/)
- [Socket.io Docs](https://socket.io/pt-br/docs/v4/)
- [ZOD Docs](https://zod.dev/)
- [Prisma Docs](https://www.prisma.io/docs/getting-started)
- [PostgreSQL Docs](https://www.postgresql.org/)