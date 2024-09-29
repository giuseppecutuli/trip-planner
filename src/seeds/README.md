# Seeds

This directory contains seed data for the database. The seed data is used to populate the database with initial data.

## How to run the seeds

To run the seeds, execute the following command:

```bash
$ pnpm run seed
```

## What the seeds do

Currently, the seeds populate the database with the supported airports by the 3rd party API.

## How to create new seeds

To create new seeds, create a new module in a dedicated folder, e.g., `src/seeds/airports`. The module should export a function that receives the database connection as an argument and returns a promise that resolves when the seeds are done.

Run the seed inside `src/seeds/run-seed.ts` getting the service created and calling the function which will populate the database.
