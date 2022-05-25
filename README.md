### Kabarak MHIS


This is a web application created to
1. Support the [Electronic version of the MCH Booklet that leverages the Android FHIR SDK](https://github.com/IntelliSOFT-Consulting/kabarak-mhmis-provider-app) 
2. Support Administration Functionality of the same application.


#### Development Mode

`yarn dev`

Production

To run a production build

##### Prequisites
- Docker
- Docker Compose


#### Using Docker

You are able to use Docker to build images for the entire project or for the respective repos.

#### Build entire project

`docker-compose up -d --build`

This should bring up the application.
By default, the application will be exposed on port 8080

Visiting http://{YOUR-IP-HERE}:8080 should display the Swagger UI Docs for the application.


#### Build the UI only

`docker build -t ./ui` or `yarn docker:build:ui`

#### Build the API only

`docker build -t ./api` or `yarn docker:build:api`


NOTE: Ensure to run Prisma migrations with
`./api/run-dev-migrations.sh`
