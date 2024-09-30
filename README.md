# Trip Planner

## Description

Trip Planner is a simple project designed to help users find the best trip from an origin to a destination.

In addition, users (after registration) can save and manage their trips (view, delete).

The current implementation supports managing multiple providers for searching trips.

Currently, only one provider is implemented, but the system is designed to be easily extendable, allowing for the addition of an unlimited number of providers.

## Technologies Used

- **NestJS**: A framework for building efficient, reliable, and scalable server-side applications.
- **Mongoose**: MongoDB object modeling designed to work in an asynchronous environment.
- **Passport**: Middleware for authentication.
- **Jest**: Testing framework.
- **Swagger**: API documentation.
- **JWT**: JSON Web Token for secure authentication.
- **Docker**: Containerization platform to simplify deployment.

## Requirements

- NodeJS 22.x
- MongoDB 6.x

## Installation

```bash
$ pnpm install
```

:warning: If you don't have `pnpm` installed, you can install it by running:

```bash
$ npm install -g pnpm
```

### Mongodb

You can run a MongoDB instance using Docker Compose:

```bash
$ docker-compose up -d
```

An instance of MongoDB will be available at `mongodb://localhost:27017/trip-planner`.


## Configuration

Create a `.env` copy of the `.env.example` file and fill in the necessary values.

```bash
$ cp .env.example .env
```

:warning: Fill `BIZAWAY_*` variables with the correct values for the connection to the BizAway API.

Run the seed script to populate the database with the supported airports:

```bash
$ pnpm run seed
```


## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```

### Coverage test

I have tested only the crucial parts of the application, such as the authentication and the trip search because of my limited time.

## API Documentation

The API documentation is available at `http://localhost:3000/api`.

## Folder Structure

The project is divided into the following folders:

- **common**: Contains shared modules and utilities.
- **core**: Contains the core modules of the application.
  - **airports**: Contains the airports module.
  - **auth**: Contains the authentication module.
  - **trips**: Contains the trips module.
  - **users**: Contains the users module.
- **seeds**: Contains seed data for the database.

