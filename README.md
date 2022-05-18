### Kabarak MHIS

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
