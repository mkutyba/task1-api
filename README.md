# task1-api
[![Build Status](https://travis-ci.org/mkutyba/task1-api.svg?branch=master)](https://travis-ci.org/mkutyba/task1-api)

Run in docker:
```
git clone https://github.com/mkutyba/task1-api.git
cd task1-api
cp .env.example .env
docker-compose run node npm install
docker-compose up -d
```

or in your system:
```
# start mongo server
git clone https://github.com/mkutyba/task1-api.git
cd task1-api
cp .env.example .env
# alter .env file with your mongo URI
npm install
npm start
```
