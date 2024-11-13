# Project and Practical

## REST APIs URL (Render Web Service)

You can access the deployed REST APIs on Render using the following URL:

- [Your choice REST API](https://your-choice-rest-api.onrender.com)
- [OpenTDB REST API](https://github.com/CWebb1/OpenTDBAPI)

## Setup Environment

Follow these steps to set up the project after cloning the repository:

1. Clone the repository:

```bash
git clone https://github.com/CWebb1/OpenTDBAPI
cd OpenTDBAPI
```

2. Install the required dependencies:

```bash
npm install
```

3. Set up environment variables by creating a `.env` file and filling in the required configurations:

```bash
DATABASE_URL="postgresql://opentdbapi_db_user:Q2rROfGTOpfuiqNVGbxi7gwXEM5ujSF2@dpg-csq1fchu0jms73flt710-a/opentdbapi_db"
JWT_SECRET="helloworld123"
JWT_LIFETIME="1h"
```

## Running REST APIs Locally

To run the REST APIs on your local machine, run the following command:

```bash
npm run dev
```

Your local API should now be running on <http://localhost:3000>.

## Database Migration

To create and apply a new migration using **Prisma**, run the following command:

```bash
npm run prisma:migrate
```

## Reset PostgreSQL Database

To reset the **PostgreSQL** database, run the following command:

```bash
npm run prisma:reset
```

## Seeding the Database with Prisma

To seed your database with additional data using **Prisma**, follow these steps:

1. Write your seed script inside `prisma/seed.js`.

2. Run the following command to execute the seeding script:

```bash
npm run prisma:seed
```

The seeding script will populate your database with the necessary data.

## Running API Tests

Ensure that your development server is running (or use a test database).

To run the **API tests** locally, run the following command:

```bash
npm run mocha:test
```

This will execute all the **API tests** to ensure the endpoints are working as expected.

## Opening Prisma Studio

To visually inspect your database using **Prisma Studio**, run the following command:

```bash
npm run prisma:studio
```

## Code Quality Checks

To check your code for any issues, run the following command:

```bash
npm run lint
```

## Code Formatting

To format your code according to project guidelines, run the following command:

```bash
npm run format
```

## Entity Relationship Diagram (ERD)

Below are the Entity Relationship Diagrams (ERDs) for the REST APIs:

![ERD-Diagram](https://github.com/CWebb1/your-choice-REST-API/blob/main/prisma-erd.svg)

