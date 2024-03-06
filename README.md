# Web app for Nero

This is the web app for the Nero API service.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Running the app

Before running the app, ensure the API is running and that you have configured an active tenant.

### Running the admin app

Change directory into `apps/admin`.

Create a `.env` file with the following contents

```sh
HOST=test.neromoto.com
PORT=3006
REACT_APP_NERO_API_BASE_URL=http://test.neromoto.com:8000/api/v1
```

To run the app, run `yarn start`

### Running the customer app

Change directory into `apps/customer`.

Create a `.env` file with the following contents

```sh
HOST=test.neromoto.com
PORT=3006
REACT_APP_NERO_API_BASE_URL=http://test.neromoto.com:8000/api/v1
REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY=<site_key>
```

Run `yarn dev:ssr`. This will run the app in server side rendering mode. Currently, hot reloading is not supported with the server side rendering mode on.

To run the app without side rendering with support for hot reloading, run `yarn start`

## Docker

To build a docker image for `admin` app, run the following at the project root. Replace `<tag-name>` with your tag name

```sh
docker build -t <tag-name> -f Dockerfile.admin .
```

To build a docker image for `customer` app, run the following at the project root. Replace `<tag-name>` with your tag name

```sh
docker build --build-arg GOOGLE_RECAPTCHA_SITE_KEY=<site_key> -t <tag-name> -f Dockerfile.customer .
```
