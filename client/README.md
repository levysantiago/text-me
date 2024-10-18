# TextMe Client

This is the client side of TextMe application. It was built in TypeScript and React.js and also uses the following tools:

# Index
- [TextMe Client](#textme-client)
- [Index](#index)
- [Technologies used](#technologies-used)
- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Executing](#executing)
  - [Build](#build)
    - [Docker](#docker)
- [Links](#links)

# Technologies used

- **Axios:** To communicate with server routes.
- **Emotion:** For components styles.
- **Socket.io:** To execute websocket operations.
- **Zod:** To validate data.
- **Dicebear lib:** To define users avatars.

# Getting started

## Installation

Install all the dependencies first:

```bash
yarn
```

or

```bash
npm install
```

## Executing

Then execute the project:

```bash
yarn start
```

or 

```bash
npm start
```

## Build

To build the project you'll need to create a `.env.production` first, define the production values and than run:

```bash
yarn build
```

or 

```bash
npm run build
```

### Docker

To run on docker you can just run:

```bash
docker compose up -d
```

if you want to run on an specific group of containers run

```bash
docker compose -p group_name up -d
```

The TextMe web application will be running at `http://localhost:3000`

# Links

- [Axios Docs](https://axios-http.com/docs/intro)
- [Emotion Docs](https://emotion.sh/docs/introduction)
- [Socket.io Docs](https://socket.io/pt-br/docs/v4/)
- [ZOD Docs](https://zod.dev/)
- [Dicebear Docs](https://www.dicebear.com/introduction/)