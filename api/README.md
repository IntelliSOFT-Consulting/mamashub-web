



#### Development Mode

`yarn dev`

#### Production

First ensure you build the project with tsc.

`yarn build`


Run the production build.

`yarn start`


#### Using Docker

`docker-compose up -d --build`

This should bring up the application.
By default, the application will be exposed on port 8080

Visiting http://YOUR-IP-HERE:8080 should display the Swagger UI Docs for the application.