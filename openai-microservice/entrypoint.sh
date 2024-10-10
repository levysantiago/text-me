#!/bin/sh
cd usr/text-me/openai-microservice
yarn --frozen-lockfile
yarn build
yarn start:prod